import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
    @IsString({ message: 'El nombre del producto debe ser un texto' })
    name: string;

    @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
    @IsNumber({maxDecimalPlaces: 2}, { message: 'El precio del producto debe ser un número' })
    price: number;

    @IsNotEmpty({ message: 'El stock del producto es obligatorio' })
    @IsNumber({maxDecimalPlaces: 0}, { message: 'Cantidad no válida' })
    stock: number;

    @IsNotEmpty({ message: 'La categoría del producto es obligatorio' })
    @IsInt({ message: 'La categoría no es válida' })
    categoryId: number;
}