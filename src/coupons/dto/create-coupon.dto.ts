import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class CreateCouponDto {

    @IsNotEmpty({message: 'El nombre del cupón es requerido'})
    name: string;

    @IsNotEmpty({message: 'El porcentaje de descuento es requerido'})
    @IsInt({message: 'El porcentaje de descuento debe ser entre 1 y 100'})
    @Max(100, {message: 'El porcentaje de descuento debe ser máximo 100'})
    @Min(1, {message: 'El porcentaje de descuento debe ser mínimo 1'})
    percentage: number;

    @IsNotEmpty({message: 'La fecha de expiración es requerida'})
    @IsDateString({}, {message: 'La fecha de expiración debe ser una fecha válida'})
    expirationDate: Date;

}
