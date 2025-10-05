import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { AppError, ErrorCode } from '../../errors/AppError';

export class ToggleFavoriteUseCase {
  constructor(private favoriteRepository: IFavoriteRepository) {}

  async execute(userId: string, productId: number): Promise<boolean> {
    try {
      const isFavorite = await this.favoriteRepository.isFavorite(userId, productId);
      
      if (isFavorite) {
        await this.favoriteRepository.removeFavorite(userId, productId);
        return false;
      } else {
        await this.favoriteRepository.addFavorite(userId, productId);
        return true;
      }
    } catch (error) {
      throw new AppError(
        'Falha ao atualizar favorito',
        ErrorCode.STORAGE_ERROR,
        error
      );
    }
  }
}