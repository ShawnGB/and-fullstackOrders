import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  productIds?: string[];
}
