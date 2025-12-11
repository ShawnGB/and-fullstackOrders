import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  productIds: string[];

  @IsNumber()
  @Min(0)
  totalPrice: number;
}
