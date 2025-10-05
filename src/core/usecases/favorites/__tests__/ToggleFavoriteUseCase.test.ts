import { ToggleFavoriteUseCase } from '../ToggleFavoriteUseCase';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { AppError, ErrorCode } from '../../../errors/AppError';

describe('ToggleFavoriteUseCase', () => {
  let toggleFavoriteUseCase: ToggleFavoriteUseCase;
  let mockFavoriteRepository: jest.Mocked<IFavoriteRepository>;

  beforeEach(() => {
    mockFavoriteRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      getFavorites: jest.fn(),
      getFavoriteIds: jest.fn(),
    } as jest.Mocked<IFavoriteRepository>;

    toggleFavoriteUseCase = new ToggleFavoriteUseCase(mockFavoriteRepository);
  });

  describe('execute', () => {
    const userId = 'user123';
    const productId = 456;

    it('deve adicionar favorito quando produto não está nos favoritos', async () => {
      mockFavoriteRepository.isFavorite.mockResolvedValue(false);
      mockFavoriteRepository.addFavorite.mockResolvedValue();

      const result = await toggleFavoriteUseCase.execute(userId, productId);

      expect(result).toBe(true);
      expect(mockFavoriteRepository.isFavorite).toHaveBeenCalledWith(userId, productId);
      expect(mockFavoriteRepository.addFavorite).toHaveBeenCalledWith(userId, productId);
      expect(mockFavoriteRepository.removeFavorite).not.toHaveBeenCalled();
    });

    it('deve remover favorito quando produto já está nos favoritos', async () => {
      mockFavoriteRepository.isFavorite.mockResolvedValue(true);
      mockFavoriteRepository.removeFavorite.mockResolvedValue();

      const result = await toggleFavoriteUseCase.execute(userId, productId);

      expect(result).toBe(false);
      expect(mockFavoriteRepository.isFavorite).toHaveBeenCalledWith(userId, productId);
      expect(mockFavoriteRepository.removeFavorite).toHaveBeenCalledWith(userId, productId);
      expect(mockFavoriteRepository.addFavorite).not.toHaveBeenCalled();
    });

    it('deve lançar AppError quando isFavorite falhar', async () => {
      const error = new Error('Erro de rede');
      mockFavoriteRepository.isFavorite.mockRejectedValue(error);

      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toThrow(AppError);
      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toMatchObject({
        code: ErrorCode.STORAGE_ERROR,
        message: 'Falha ao atualizar favorito',
      });
    });

    it('deve lançar AppError quando addFavorite falhar', async () => {
      mockFavoriteRepository.isFavorite.mockResolvedValue(false);
      const error = new Error('Erro de rede');
      mockFavoriteRepository.addFavorite.mockRejectedValue(error);

      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toThrow(AppError);
      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toMatchObject({
        code: ErrorCode.STORAGE_ERROR,
        message: 'Falha ao atualizar favorito',
      });
    });

    it('deve lançar AppError quando removeFavorite falhar', async () => {
      mockFavoriteRepository.isFavorite.mockResolvedValue(true);
      const error = new Error('Erro de rede');
      mockFavoriteRepository.removeFavorite.mockRejectedValue(error);

      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toThrow(AppError);
      await expect(toggleFavoriteUseCase.execute(userId, productId)).rejects.toMatchObject({
        code: ErrorCode.STORAGE_ERROR,
        message: 'Falha ao atualizar favorito',
      });
    });

    it('deve preservar o erro original', async () => {
      const originalError = new Error('Erro de rede');
      mockFavoriteRepository.isFavorite.mockRejectedValue(originalError);

      try {
        await toggleFavoriteUseCase.execute(userId, productId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(originalError);
      }
    });

    it('deve funcionar com diferentes tipos de userId', async () => {
      const userIds = ['string-id', '123', 'user@email.com', 'uuid-format'];
      
      for (const id of userIds) {
        mockFavoriteRepository.isFavorite.mockResolvedValue(false);
        mockFavoriteRepository.addFavorite.mockResolvedValue();

        const result = await toggleFavoriteUseCase.execute(id, productId);

        expect(result).toBe(true);
        expect(mockFavoriteRepository.isFavorite).toHaveBeenCalledWith(id, productId);
      }
    });

    it('deve funcionar com diferentes tipos de productId', async () => {
      const productIds = [1, 999, 0, -1];
      
      for (const id of productIds) {
        mockFavoriteRepository.isFavorite.mockResolvedValue(false);
        mockFavoriteRepository.addFavorite.mockResolvedValue();

        const result = await toggleFavoriteUseCase.execute(userId, id);

        expect(result).toBe(true);
        expect(mockFavoriteRepository.isFavorite).toHaveBeenCalledWith(userId, id);
      }
    });
  });
});
