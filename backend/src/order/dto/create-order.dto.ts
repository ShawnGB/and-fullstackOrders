import {
  IsArray,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  productIds: string[];
}
