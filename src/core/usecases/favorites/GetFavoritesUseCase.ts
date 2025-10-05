import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { Product } from '../../domain/entities/Product';
import { AppError, ErrorCode } from '../../errors/AppError';

export class GetFavoritesUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async execute(userId: string): Promise<Product[]> {
    try {
      return await this.favoriteRepository.getFavorites(userId);
    } catch (error) {
      throw new AppError(
        'Falha ao buscar favoritos',
        ErrorCode.STORAGE_ERROR,
        error
      );
    }
  }
}