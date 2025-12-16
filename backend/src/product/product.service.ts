import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);

    // Check if product is in any orders
    const ordersWithProduct = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.products', 'product')
      .where('product.id = :productId', { productId: id })
      .getCount();

    if (ordersWithProduct > 0) {
      throw new BadRequestException(
        `Cannot delete product. It is referenced in ${ordersWithProduct} order(s).`
      );
    }

    await this.productRepository.remove(product);
  }
}
