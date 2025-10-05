import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { AppError, ErrorCode } from '../../errors/AppError';

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(category?: string): Promise<Product[]> {
    try {
      if (category) {
        return await this.productRepository.getByCategory(category);
      }
      
      return await this.productRepository.getAll();
    } catch (error) {
      throw new AppError(
        'Falha ao buscar produtos',
        ErrorCode.NETWORK_ERROR,
        error
      );
    }
  }
}