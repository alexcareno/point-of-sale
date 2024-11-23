import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { IdValidatorPipe } from '../common/pipes/id-validator/id-validator.pipe';

@Controller('transactions')
export class TransactionsController {
	constructor(private readonly transactionsService: TransactionsService) { }

	@Post()
	create(@Body() createTransactionDto: CreateTransactionDto) {
		return this.transactionsService.create(createTransactionDto);
	}

	@Get()
	findAll(@Query('transactionDate') transactionDate: string) {
		return this.transactionsService.findAll(transactionDate);
	}

	@Get(':id')
	findOne(@Param('id', IdValidatorPipe) id: string) {
		return this.transactionsService.findOne(+id);
	}

	@Delete(':id')
	remove(@Param('id', IdValidatorPipe) id: string) {
		return this.transactionsService.remove(+id);
	}
}
