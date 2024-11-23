import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class TransactionsService {

	constructor(
		@InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
		@InjectRepository(TransactionContent) private readonly transactionContentRepository: Repository<TransactionContent>,
		@InjectRepository(Product) private readonly ProductRepository: Repository<Product>,
	) { }

	async create(createTransactionDto: CreateTransactionDto) {

		await this.ProductRepository.manager.transaction(async (transactionEntityManager) => {
			const transaction = new Transaction();
			transaction.total = createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0);
			for (const contents of createTransactionDto.contents) {
				const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId });

				let errors = [];
				if (!product) {
					errors.push(`El producto con id ${contents.productId} no existe`);
					throw new NotFoundException(errors);
				}
				if (contents.quantity > product.stock) {
					errors.push(`El producto ${product.name} no tiene suficiente stock`);
					throw new BadRequestException(errors);
				}
				product.stock -= contents.quantity;
				// Create tansactionContents instance
				const transactionContent = new TransactionContent();
				transactionContent.price = contents.price;
				transactionContent.quantity = contents.quantity;
				transactionContent.product = product;
				transactionContent.transaction = transaction;
				await transactionEntityManager.save(transaction);
				await transactionEntityManager.save(transactionContent);
			}
		});

		return "Venta almacenada correctamente";
	}

	findAll(transactionDate?: string) {
		const options: FindManyOptions<Transaction> = {
			relations: {
				contents: true
			}
		};

		if (transactionDate) {
			const date = parseISO(transactionDate);
			if (!isValid(date)) {
				throw new BadRequestException("Fecha inválida");
			}

			const start = startOfDay(date);
			const end = endOfDay(date);

			options.where = {
				transactionDate: Between(start, end)
			};
		}
		return this.transactionRepository.find(options);
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
			relations: {
				contents: true
			}
		});

		if(!transaction) {
			throw new NotFoundException(`Transacción con id ${id} no encontrada`);
		}
		return transaction;
	}

	async remove(id: number) {
		const transaction = await this.findOne(id);

		for (const content of transaction.contents) {
			const product = await this.ProductRepository.findOneBy({id: content.product.id});
			product.stock += content.quantity;
			await this.ProductRepository.save(product);
			const transactionContents = await this.transactionContentRepository.findOneBy({id: content.id});
			await this.transactionContentRepository.remove(transactionContents);
		}

		await this.transactionRepository.remove(transaction);
		return {
			message: 'Venta eliminada correctamente',
			data: transaction
		}
	}
}
