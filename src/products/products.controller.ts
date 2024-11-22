import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsQueryDto } from './dto/get-product.dto';
import { IdValidatorPipe } from 'src/common/pipes/id-validator/id-validator.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    const category = query.category_id = query.category_id ? query.category_id : null;
    const take = query.take = query.take ? query.take : 10;
    const skip = query.skip = query.skip ? query.skip : 0;
    return this.productsService.findAll(category, take, skip);
  }

  @Get(':id')
  findOne(@Param('id', IdValidatorPipe) id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', IdValidatorPipe) id: string,
    @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidatorPipe) id: string) {
    return this.productsService.remove(+id);
  }
}