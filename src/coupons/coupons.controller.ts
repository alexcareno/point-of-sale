import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { IdValidatorPipe } from '../common/pipes/id-validator/id-validator.pipe';

@Controller('coupons')
export class CouponsController {
	constructor(private readonly couponsService: CouponsService) { }

	@Post()
	create(@Body() createCouponDto: CreateCouponDto) {
		return this.couponsService.create(createCouponDto);
	}

	@Post('/apply-coupon')
	@HttpCode(200)
	applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
		return this.couponsService.applyCoupon(applyCouponDto.coupon_name);
	}

	@Get()
	findAll() {
		return this.couponsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', IdValidatorPipe) id: string) {
		return this.couponsService.findOne(+id);
	}

	@Put(':id')
	update(
		@Param('id', IdValidatorPipe) id: string,
		@Body() updateCouponDto: UpdateCouponDto
	) {
		return this.couponsService.update(+id, updateCouponDto);
	}

	@Delete(':id')
	remove(@Param('id', IdValidatorPipe) id: string) {
		return this.couponsService.remove(+id);
	}
}
