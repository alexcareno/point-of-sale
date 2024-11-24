import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {

	constructor(
		@InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
	) {}

	create(createCouponDto: CreateCouponDto) {
		return this.couponRepository.save(createCouponDto);
	}

	async applyCoupon(couponName: string) {
		const coupon = await this.couponRepository.findOneBy({name: couponName});
		if (!coupon) {
			throw new NotFoundException(`El cupón ${couponName} no existe`);
		}

		const currentDate = new Date();
		const expirationDate = endOfDay(coupon.expirationDate);

		if(isAfter(currentDate, expirationDate)) {
			throw new UnprocessableEntityException(`El cupón ${couponName} ha expirado`);
		}

		return {
			message: `Cupón ${couponName} aplicado con éxito`,
			data: coupon
		}
	}

	findAll() {
		return this.couponRepository.find();
	}

	async findOne(id: number) {
		const coupon = await this.couponRepository.findOneBy({id});
		if (!coupon) {
			throw new NotFoundException(`Coupon #${id} no existe`);
		}
		return coupon;
	}

	async update(id: number, updateCouponDto: UpdateCouponDto) {
		const coupon = await this.findOne(id);
		Object.assign(coupon, updateCouponDto);
		return await this.couponRepository.save(coupon);
	}

	async remove(id: number) {
		const coupon = await this.findOne(id);
		await this.couponRepository.remove(coupon);
		return {
			message: `Coupon #${id} eliminado`,
			data: coupon
		};
	}
}
