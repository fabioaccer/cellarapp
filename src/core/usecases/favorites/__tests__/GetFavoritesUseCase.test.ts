import { GetFavoritesUseCase } from '../GetFavoritesUseCase';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { Product } from '../../../domain/entities/Product';
import { AppError, ErrorCode } from '../../../errors/AppError';

describe('GetFavoritesUseCase', () => {
  let getFavoritesUseCase: GetFavoritesUseCase;
  let mockFavoriteRepository: jest.Mocked<IFavoriteRepository>;

  beforeEach(() => {
    mockFavoriteRepository = {
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      getFavorites: jest.fn(),
      getFavoriteIds: jest.fn(),
    } as jest.Mocked<IFavoriteRepository>;

    getFavoritesUseCase = new GetFavoritesUseCase(mockFavoriteRepository);
  });

  describe('execute', () => {
    const userId = 'user123';
    
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Produto 1',
        price: 100,
        description: 'Descrição do produto 1',
        category: 'categoria1',
        image: 'image1.jpg',
      },
      {
        id: 2,
        title: 'Produto 2',
        price: 200,
        description: 'Descrição do produto 2',
        category: 'categoria2',
        image: 'image2.jpg',
      },
    ];

    it('deve retornar lista de produtos favoritos', async () => {
      mockFavoriteRepository.getFavorites.mockResolvedValue(mockProducts);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toEqual(mockProducts);
      expect(mockFavoriteRepository.getFavorites).toHaveBeenCalledWith(userId);
    });

    it('deve retornar lista vazia quando não há favoritos', async () => {
      mockFavoriteRepository.getFavorites.mockResolvedValue([]);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toEqual([]);
      expect(mockFavoriteRepository.getFavorites).toHaveBeenCalledWith(userId);
    });

    it('deve retornar lista com um produto favorito', async () => {
      const singleProduct = [mockProducts[0]];
      mockFavoriteRepository.getFavorites.mockResolvedValue(singleProduct);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toEqual(singleProduct);
      expect(result).toHaveLength(1);
    });

    it('deve retornar lista com muitos produtos favoritos', async () => {
      const manyProducts = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `Produto ${index + 1}`,
        price: (index + 1) * 100,
        description: `Descrição do produto ${index + 1}`,
        category: `categoria${index + 1}`,
        image: `image${index + 1}.jpg`,
      }));
      
      mockFavoriteRepository.getFavorites.mockResolvedValue(manyProducts);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toEqual(manyProducts);
      expect(result).toHaveLength(10);
    });

    it('deve lançar AppError quando repositório falhar', async () => {
      const error = new Error('Erro de rede');
      mockFavoriteRepository.getFavorites.mockRejectedValue(error);

      await expect(getFavoritesUseCase.execute(userId)).rejects.toThrow(AppError);
      await expect(getFavoritesUseCase.execute(userId)).rejects.toMatchObject({
        code: ErrorCode.STORAGE_ERROR,
        message: 'Falha ao buscar favoritos',
      });
    });

    it('deve preservar o erro original', async () => {
      const originalError = new Error('Erro de rede');
      mockFavoriteRepository.getFavorites.mockRejectedValue(originalError);

      try {
        await getFavoritesUseCase.execute(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(originalError);
      }
    });

    it('deve funcionar com diferentes tipos de userId', async () => {
      const userIds = ['string-id', '123', 'user@email.com', 'uuid-format'];
      
      for (const id of userIds) {
        mockFavoriteRepository.getFavorites.mockResolvedValue([]);

        const result = await getFavoritesUseCase.execute(id);

        expect(result).toEqual([]);
        expect(mockFavoriteRepository.getFavorites).toHaveBeenCalledWith(id);
      }
    });

    it('deve retornar produtos com propriedades completas', async () => {
      const completeProduct: Product = {
        id: 999,
        title: 'Produto Completo',
        price: 999.99,
        description: 'Descrição completa do produto com muitos detalhes',
        category: 'categoria-especial',
        image: 'https://example.com/image.jpg',
      };
      
      mockFavoriteRepository.getFavorites.mockResolvedValue([completeProduct]);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(completeProduct);
      expect(result[0].id).toBe(999);
      expect(result[0].title).toBe('Produto Completo');
      expect(result[0].price).toBe(999.99);
      expect(result[0].description).toBe('Descrição completa do produto com muitos detalhes');
      expect(result[0].category).toBe('categoria-especial');
      expect(result[0].image).toBe('https://example.com/image.jpg');
    });

    it('deve lidar com produtos com valores extremos', async () => {
      const extremeProducts: Product[] = [
        {
          id: 0,
          title: '',
          price: 0,
          description: '',
          category: '',
          image: '',
        },
        {
          id: Number.MAX_SAFE_INTEGER,
          title: 'A'.repeat(1000),
          price: Number.MAX_VALUE,
          description: 'B'.repeat(10000),
          category: 'C'.repeat(500),
          image: 'D'.repeat(1000),
        },
      ];
      
      mockFavoriteRepository.getFavorites.mockResolvedValue(extremeProducts);

      const result = await getFavoritesUseCase.execute(userId);

      expect(result).toEqual(extremeProducts);
      expect(result).toHaveLength(2);
    });
  });
});
