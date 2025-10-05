import { FavoriteRepositoryImpl } from '../FavoriteRepositoryImpl';
import { FirestoreDataSource } from '../../datasources/local/FirestoreDataSource';
import { ProductApiDataSource } from '../../datasources/remote/ProductApiDataSource';
import { Product } from '../../../core/domain/entities/Product';
import { AppError, ErrorCode } from '../../../core/errors/AppError';

describe('FavoriteRepositoryImpl', () => {
  let favoriteRepository: FavoriteRepositoryImpl;
  let mockFirestoreDataSource: jest.Mocked<FirestoreDataSource>;
  let mockApiDataSource: jest.Mocked<ProductApiDataSource>;
  let mockProducts: Product[];

  beforeEach(() => {
    mockFirestoreDataSource = {
      getFavoriteIds: jest.fn(),
      isFavorite: jest.fn(),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      clearFavorites: jest.fn(),
    } as any;

    mockApiDataSource = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductsByCategory: jest.fn(),
      getCategories: jest.fn(),
      getProductsWithLimit: jest.fn(),
    } as any;

    favoriteRepository = new FavoriteRepositoryImpl(
      mockFirestoreDataSource,
      mockApiDataSource
    );

    mockProducts = [
      {
        id: 1,
        title: 'Product 1',
        price: 99.99,
        description: 'Description 1',
        category: 'Electronics',
        image: 'https://example.com/image1.jpg',
      },
      {
        id: 2,
        title: 'Product 2',
        price: 149.99,
        description: 'Description 2',
        category: 'Clothing',
        image: 'https://example.com/image2.jpg',
      },
    ];

    jest.clearAllMocks();
  });

  describe('getFavorites', () => {
    const userId = 'user123';

    it('should get favorites successfully', async () => {
      const favoriteIds = [1, 2];
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(favoriteIds);
      mockApiDataSource.getProductById
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(mockProducts[1]);

      const result = await favoriteRepository.getFavorites(userId);

      expect(mockFirestoreDataSource.getFavoriteIds).toHaveBeenCalledWith(userId);
      expect(mockApiDataSource.getProductById).toHaveBeenCalledTimes(2);
      expect(mockApiDataSource.getProductById).toHaveBeenNthCalledWith(1, 1);
      expect(mockApiDataSource.getProductById).toHaveBeenNthCalledWith(2, 2);
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no favorites exist', async () => {
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue([]);

      const result = await favoriteRepository.getFavorites(userId);

      expect(mockFirestoreDataSource.getFavoriteIds).toHaveBeenCalledWith(userId);
      expect(mockApiDataSource.getProductById).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should filter out null products', async () => {
      const favoriteIds = [1, 2, 3];
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(favoriteIds);
      mockApiDataSource.getProductById
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockProducts[1]);

      const result = await favoriteRepository.getFavorites(userId);

      expect(mockFirestoreDataSource.getFavoriteIds).toHaveBeenCalledWith(userId);
      expect(mockApiDataSource.getProductById).toHaveBeenCalledTimes(3);
      expect(result).toEqual([mockProducts[0], mockProducts[1]]);
    });

    it('should throw AppError when getFavoriteIds fails', async () => {
      const error = new Error('Firestore error');
      mockFirestoreDataSource.getFavoriteIds.mockRejectedValue(error);

      await expect(favoriteRepository.getFavorites(userId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.getFavorites(userId)).rejects.toThrow('Erro ao buscar favoritos');
      
      try {
        await favoriteRepository.getFavorites(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should throw AppError when getProductById fails', async () => {
      const favoriteIds = [1];
      const error = new Error('API error');
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(favoriteIds);
      mockApiDataSource.getProductById.mockRejectedValue(error);

      await expect(favoriteRepository.getFavorites(userId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.getFavorites(userId)).rejects.toThrow('Erro ao buscar favoritos');
    });
  });

  describe('isFavorite', () => {
    const userId = 'user123';
    const productId = 1;

    it('should return true when product is favorite', async () => {
      mockFirestoreDataSource.isFavorite.mockResolvedValue(true);

      const result = await favoriteRepository.isFavorite(userId, productId);

      expect(mockFirestoreDataSource.isFavorite).toHaveBeenCalledWith(userId, productId);
      expect(result).toBe(true);
    });

    it('should return false when product is not favorite', async () => {
      mockFirestoreDataSource.isFavorite.mockResolvedValue(false);

      const result = await favoriteRepository.isFavorite(userId, productId);

      expect(mockFirestoreDataSource.isFavorite).toHaveBeenCalledWith(userId, productId);
      expect(result).toBe(false);
    });

    it('should throw AppError when isFavorite fails', async () => {
      const error = new Error('Firestore error');
      mockFirestoreDataSource.isFavorite.mockRejectedValue(error);

      await expect(favoriteRepository.isFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.isFavorite(userId, productId)).rejects.toThrow('Erro ao verificar favorito');
      
      try {
        await favoriteRepository.isFavorite(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('addFavorite', () => {
    const userId = 'user123';
    const productId = 1;

    it('should add favorite successfully', async () => {
      mockFirestoreDataSource.addFavorite.mockResolvedValue(undefined);

      await favoriteRepository.addFavorite(userId, productId);

      expect(mockFirestoreDataSource.addFavorite).toHaveBeenCalledWith(userId, productId);
    });

    it('should throw AppError when addFavorite fails', async () => {
      const error = new Error('Firestore error');
      mockFirestoreDataSource.addFavorite.mockRejectedValue(error);

      await expect(favoriteRepository.addFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.addFavorite(userId, productId)).rejects.toThrow('Erro ao adicionar favorito');
      
      try {
        await favoriteRepository.addFavorite(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('removeFavorite', () => {
    const userId = 'user123';
    const productId = 1;

    it('should remove favorite successfully', async () => {
      mockFirestoreDataSource.removeFavorite.mockResolvedValue(undefined);

      await favoriteRepository.removeFavorite(userId, productId);

      expect(mockFirestoreDataSource.removeFavorite).toHaveBeenCalledWith(userId, productId);
    });

    it('should throw AppError when removeFavorite fails', async () => {
      const error = new Error('Firestore error');
      mockFirestoreDataSource.removeFavorite.mockRejectedValue(error);

      await expect(favoriteRepository.removeFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.removeFavorite(userId, productId)).rejects.toThrow('Erro ao remover favorito');
      
      try {
        await favoriteRepository.removeFavorite(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('getFavoriteIds', () => {
    const userId = 'user123';

    it('should get favorite IDs successfully', async () => {
      const favoriteIds = [1, 2, 3];
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(favoriteIds);

      const result = await favoriteRepository.getFavoriteIds(userId);

      expect(mockFirestoreDataSource.getFavoriteIds).toHaveBeenCalledWith(userId);
      expect(result).toEqual(favoriteIds);
    });

    it('should return empty array when no favorites exist', async () => {
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue([]);

      const result = await favoriteRepository.getFavoriteIds(userId);

      expect(mockFirestoreDataSource.getFavoriteIds).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });

    it('should throw AppError when getFavoriteIds fails', async () => {
      const error = new Error('Firestore error');
      mockFirestoreDataSource.getFavoriteIds.mockRejectedValue(error);

      await expect(favoriteRepository.getFavoriteIds(userId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.getFavoriteIds(userId)).rejects.toThrow('Erro ao buscar IDs de favoritos');
      
      try {
        await favoriteRepository.getFavoriteIds(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('integration scenarios', () => {
    const userId = 'user123';
    const productId = 1;

    it('should handle complete favorite workflow', async () => {
      // Check if favorite exists (false)
      mockFirestoreDataSource.isFavorite.mockResolvedValue(false);
      const isFavoriteBefore = await favoriteRepository.isFavorite(userId, productId);
      expect(isFavoriteBefore).toBe(false);

      // Add favorite
      mockFirestoreDataSource.addFavorite.mockResolvedValue(undefined);
      await favoriteRepository.addFavorite(userId, productId);
      expect(mockFirestoreDataSource.addFavorite).toHaveBeenCalledWith(userId, productId);

      // Check if favorite exists (true)
      mockFirestoreDataSource.isFavorite.mockResolvedValue(true);
      const isFavoriteAfter = await favoriteRepository.isFavorite(userId, productId);
      expect(isFavoriteAfter).toBe(true);

      // Get favorites
      const favoriteIds = [productId];
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(favoriteIds);
      mockApiDataSource.getProductById.mockResolvedValue(mockProducts[0]);
      
      const favorites = await favoriteRepository.getFavorites(userId);
      expect(favorites).toEqual([mockProducts[0]]);

      // Remove favorite
      mockFirestoreDataSource.removeFavorite.mockResolvedValue(undefined);
      await favoriteRepository.removeFavorite(userId, productId);
      expect(mockFirestoreDataSource.removeFavorite).toHaveBeenCalledWith(userId, productId);
    });

    it('should handle multiple favorites management', async () => {
      const productIds = [1, 2, 3];
      
      // Get initial favorites (empty)
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue([]);
      const initialFavorites = await favoriteRepository.getFavorites(userId);
      expect(initialFavorites).toEqual([]);

      // Add multiple favorites
      mockFirestoreDataSource.addFavorite.mockResolvedValue(undefined);
      for (const id of productIds) {
        await favoriteRepository.addFavorite(userId, id);
      }
      expect(mockFirestoreDataSource.addFavorite).toHaveBeenCalledTimes(3);

      // Get updated favorites
      mockFirestoreDataSource.getFavoriteIds.mockResolvedValue(productIds);
      mockApiDataSource.getProductById
        .mockResolvedValueOnce(mockProducts[0])
        .mockResolvedValueOnce(mockProducts[1])
        .mockResolvedValueOnce(null); // Simulate one product not found

      const updatedFavorites = await favoriteRepository.getFavorites(userId);
      expect(updatedFavorites).toEqual([mockProducts[0], mockProducts[1]]); // null filtered out
    });

    it('should handle error scenarios consistently', async () => {
      const error = new Error('Storage error');
      
      // All methods should wrap errors in AppError
      mockFirestoreDataSource.getFavoriteIds.mockRejectedValue(error);
      mockFirestoreDataSource.isFavorite.mockRejectedValue(error);
      mockFirestoreDataSource.addFavorite.mockRejectedValue(error);
      mockFirestoreDataSource.removeFavorite.mockRejectedValue(error);

      await expect(favoriteRepository.getFavorites(userId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.isFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.addFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.removeFavorite(userId, productId)).rejects.toThrow(AppError);
      await expect(favoriteRepository.getFavoriteIds(userId)).rejects.toThrow(AppError);
    });
  });
});
