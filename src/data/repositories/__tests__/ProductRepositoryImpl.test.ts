import { ProductRepositoryImpl } from '../ProductRepositoryImpl';
import { ProductApiDataSource } from '../../datasources/remote/ProductApiDataSource';
import { Product } from '../../../core/domain/entities/Product';
import { AppError, ErrorCode } from '../../../core/errors/AppError';

describe('ProductRepositoryImpl', () => {
  let productRepository: ProductRepositoryImpl;
  let mockApiDataSource: jest.Mocked<ProductApiDataSource>;
  let mockProducts: Product[];

  beforeEach(() => {
    mockApiDataSource = {
      getProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductsByCategory: jest.fn(),
      getCategories: jest.fn(),
      getProductsWithLimit: jest.fn(),
    } as any;

    productRepository = new ProductRepositoryImpl(mockApiDataSource);

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

  describe('getAll', () => {
    it('should get all products successfully', async () => {
      mockApiDataSource.getProducts.mockResolvedValue(mockProducts);

      const result = await productRepository.getAll();

      expect(mockApiDataSource.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      mockApiDataSource.getProducts.mockResolvedValue([]);

      const result = await productRepository.getAll();

      expect(mockApiDataSource.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw AppError when getProducts fails', async () => {
      const error = new Error('Network error');
      mockApiDataSource.getProducts.mockRejectedValue(error);

      await expect(productRepository.getAll()).rejects.toThrow(AppError);
      await expect(productRepository.getAll()).rejects.toThrow('Erro ao buscar produtos');
      
      try {
        await productRepository.getAll();
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('getById', () => {
    const productId = 1;

    it('should get product by id successfully', async () => {
      mockApiDataSource.getProductById.mockResolvedValue(mockProducts[0]);

      const result = await productRepository.getById(productId);

      expect(mockApiDataSource.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProducts[0]);
    });

    it('should return null when product not found', async () => {
      const notFoundError = new AppError('Not found', ErrorCode.NOT_FOUND);
      mockApiDataSource.getProductById.mockRejectedValue(notFoundError);

      const result = await productRepository.getById(999);

      expect(mockApiDataSource.getProductById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should throw AppError for other errors', async () => {
      const networkError = new AppError('Network error', ErrorCode.NETWORK_ERROR);
      mockApiDataSource.getProductById.mockRejectedValue(networkError);

      await expect(productRepository.getById(productId)).rejects.toThrow(AppError);
      await expect(productRepository.getById(productId)).rejects.toThrow('Erro ao buscar produto');
      
      try {
        await productRepository.getById(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(networkError);
      }
    });

    it('should throw AppError for generic errors', async () => {
      const genericError = new Error('Generic error');
      mockApiDataSource.getProductById.mockRejectedValue(genericError);

      await expect(productRepository.getById(productId)).rejects.toThrow(AppError);
      await expect(productRepository.getById(productId)).rejects.toThrow('Erro ao buscar produto');
      
      try {
        await productRepository.getById(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(genericError);
      }
    });
  });

  describe('getByCategory', () => {
    const category = 'Electronics';

    it('should get products by category successfully', async () => {
      const electronicsProducts = [mockProducts[0]];
      mockApiDataSource.getProductsByCategory.mockResolvedValue(electronicsProducts);

      const result = await productRepository.getByCategory(category);

      expect(mockApiDataSource.getProductsByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual(electronicsProducts);
    });

    it('should return empty array when no products in category', async () => {
      mockApiDataSource.getProductsByCategory.mockResolvedValue([]);

      const result = await productRepository.getByCategory(category);

      expect(mockApiDataSource.getProductsByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual([]);
    });

    it('should throw AppError when getProductsByCategory fails', async () => {
      const error = new Error('Network error');
      mockApiDataSource.getProductsByCategory.mockRejectedValue(error);

      await expect(productRepository.getByCategory(category)).rejects.toThrow(AppError);
      await expect(productRepository.getByCategory(category)).rejects.toThrow('Erro ao buscar produtos por categoria');
      
      try {
        await productRepository.getByCategory(category);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle different categories', async () => {
      const clothingProducts = [mockProducts[1]];
      mockApiDataSource.getProductsByCategory.mockResolvedValue(clothingProducts);

      const result = await productRepository.getByCategory('Clothing');

      expect(mockApiDataSource.getProductsByCategory).toHaveBeenCalledWith('Clothing');
      expect(result).toEqual(clothingProducts);
    });
  });

  describe('getCategories', () => {
    it('should get categories successfully', async () => {
      const categories = ['Electronics', 'Clothing', 'Books'];
      mockApiDataSource.getCategories.mockResolvedValue(categories);

      const result = await productRepository.getCategories();

      expect(mockApiDataSource.getCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories exist', async () => {
      mockApiDataSource.getCategories.mockResolvedValue([]);

      const result = await productRepository.getCategories();

      expect(mockApiDataSource.getCategories).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw AppError when getCategories fails', async () => {
      const error = new Error('Network error');
      mockApiDataSource.getCategories.mockRejectedValue(error);

      await expect(productRepository.getCategories()).rejects.toThrow(AppError);
      await expect(productRepository.getCategories()).rejects.toThrow('Erro ao buscar categorias');
      
      try {
        await productRepository.getCategories();
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete product workflow', async () => {
      // Get all products
      mockApiDataSource.getProducts.mockResolvedValue(mockProducts);
      const allProducts = await productRepository.getAll();
      expect(allProducts).toEqual(mockProducts);

      // Get specific product
      mockApiDataSource.getProductById.mockResolvedValue(mockProducts[0]);
      const product = await productRepository.getById(1);
      expect(product).toEqual(mockProducts[0]);

      // Get products by category
      const electronicsProducts = [mockProducts[0]];
      mockApiDataSource.getProductsByCategory.mockResolvedValue(electronicsProducts);
      const categoryProducts = await productRepository.getByCategory('Electronics');
      expect(categoryProducts).toEqual(electronicsProducts);

      // Get categories
      const categories = ['Electronics', 'Clothing'];
      mockApiDataSource.getCategories.mockResolvedValue(categories);
      const categoriesResult = await productRepository.getCategories();
      expect(categoriesResult).toEqual(categories);
    });

    it('should handle error scenarios consistently', async () => {
      const networkError = new Error('Network error');
      
      // All methods should wrap errors in AppError
      mockApiDataSource.getProducts.mockRejectedValue(networkError);
      mockApiDataSource.getProductById.mockRejectedValue(networkError);
      mockApiDataSource.getProductsByCategory.mockRejectedValue(networkError);
      mockApiDataSource.getCategories.mockRejectedValue(networkError);

      await expect(productRepository.getAll()).rejects.toThrow(AppError);
      await expect(productRepository.getById(1)).rejects.toThrow(AppError);
      await expect(productRepository.getByCategory('test')).rejects.toThrow(AppError);
      await expect(productRepository.getCategories()).rejects.toThrow(AppError);
    });

    it('should handle not found scenario specifically for getById', async () => {
      const notFoundError = new AppError('Not found', ErrorCode.NOT_FOUND);
      mockApiDataSource.getProductById.mockRejectedValue(notFoundError);

      const result = await productRepository.getById(999);
      expect(result).toBeNull();

      // Other methods should still throw the wrapped error
      mockApiDataSource.getProducts.mockRejectedValue(notFoundError);
      await expect(productRepository.getAll()).rejects.toThrow('Erro ao buscar produtos');
    });

    it('should handle different product scenarios', async () => {
      // Test with single product
      const singleProduct = [mockProducts[0]];
      mockApiDataSource.getProducts.mockResolvedValue(singleProduct);
      const result1 = await productRepository.getAll();
      expect(result1).toEqual(singleProduct);

      // Test with multiple products
      mockApiDataSource.getProducts.mockResolvedValue(mockProducts);
      const result2 = await productRepository.getAll();
      expect(result2).toEqual(mockProducts);

      // Test with no products
      mockApiDataSource.getProducts.mockResolvedValue([]);
      const result3 = await productRepository.getAll();
      expect(result3).toEqual([]);
    });

    it('should handle category filtering scenarios', async () => {
      // Test electronics category
      const electronicsProducts = [mockProducts[0]];
      mockApiDataSource.getProductsByCategory.mockResolvedValue(electronicsProducts);
      const electronicsResult = await productRepository.getByCategory('Electronics');
      expect(electronicsResult).toEqual(electronicsProducts);

      // Test clothing category
      const clothingProducts = [mockProducts[1]];
      mockApiDataSource.getProductsByCategory.mockResolvedValue(clothingProducts);
      const clothingResult = await productRepository.getByCategory('Clothing');
      expect(clothingResult).toEqual(clothingProducts);

      // Test empty category
      mockApiDataSource.getProductsByCategory.mockResolvedValue([]);
      const emptyResult = await productRepository.getByCategory('NonExistent');
      expect(emptyResult).toEqual([]);
    });
  });
});
