import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IdValidatorPipe } from '../common/pipes/id-validator/id-validator.pipe';

@Controller('categories')
export class CategoriesController {

	constructor(
		private readonly categoriesService: CategoriesService
	) { }

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.create(createCategoryDto);
	}

	@Get()
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', IdValidatorPipe) id: string) {
		return this.categoriesService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id', IdValidatorPipe) id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoriesService.update(+id, updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id', IdValidatorPipe) id: string) {
		return this.categoriesService.remove(+id);
	}
}
