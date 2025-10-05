import { ProductApiDataSource } from '../ProductApiDataSource';
import { Product } from '../../../../core/domain/entities/Product';
import { AppError, ErrorCode } from '../../../../core/errors/AppError';
import { HttpClient } from '../../../../infrastructure/http/HttpClient';

// Mock HttpClient
jest.mock('../../../../infrastructure/http/HttpClient');
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('ProductApiDataSource', () => {
  let productApiDataSource: ProductApiDataSource;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any;

    MockedHttpClient.mockImplementation(() => mockHttpClient);
    productApiDataSource = new ProductApiDataSource();
    
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    const mockProducts: Product[] = [
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

    it('should get products successfully', async () => {
      mockHttpClient.get.mockResolvedValue(mockProducts);

      const result = await productApiDataSource.getProducts();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('should handle AppError from HttpClient', async () => {
      const appError = new AppError('Network error', ErrorCode.NETWORK_ERROR);
      mockHttpClient.get.mockRejectedValue(appError);

      await expect(productApiDataSource.getProducts()).rejects.toThrow(appError);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products');
    });

    it('should wrap generic error in AppError', async () => {
      const genericError = new Error('Generic error');
      mockHttpClient.get.mockRejectedValue(genericError);

      await expect(productApiDataSource.getProducts()).rejects.toThrow(AppError);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products');
    });

    it('should handle empty products array', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      const result = await productApiDataSource.getProducts();

      expect(result).toEqual([]);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('getProductById', () => {
    const mockProduct: Product = {
      id: 1,
      title: 'Single Product',
      price: 199.99,
      description: 'Single product description',
      category: 'Electronics',
      image: 'https://example.com/single.jpg',
    };

    it('should get product by id successfully', async () => {
      mockHttpClient.get.mockResolvedValue(mockProduct);

      const result = await productApiDataSource.getProductById(1);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product not found', async () => {
      const notFoundError = new AppError('Not found', ErrorCode.NOT_FOUND);
      mockHttpClient.get.mockRejectedValue(notFoundError);

      const result = await productApiDataSource.getProductById(999);

      expect(result).toBeNull();
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/999');
    });

    it('should handle other AppErrors', async () => {
      const appError = new AppError('Server error', ErrorCode.NETWORK_ERROR);
      mockHttpClient.get.mockRejectedValue(appError);

      await expect(productApiDataSource.getProductById(1)).rejects.toThrow(appError);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/1');
    });

    it('should wrap generic error in AppError', async () => {
      const genericError = new Error('Generic error');
      mockHttpClient.get.mockRejectedValue(genericError);

      await expect(productApiDataSource.getProductById(1)).rejects.toThrow(AppError);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/1');
    });

    it('should handle different product IDs', async () => {
      const product2 = { ...mockProduct, id: 2, title: 'Product 2' };
      mockHttpClient.get.mockResolvedValue(product2);

      const result = await productApiDataSource.getProductById(2);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/2');
      expect(result).toEqual(product2);
    });
  });

  describe('getProductsByCategory', () => {
    const mockCategoryProducts: Product[] = [
      {
        id: 1,
        title: 'Electronics Product',
        price: 299.99,
        description: 'Electronics description',
        category: 'Electronics',
        image: 'https://example.com/electronics.jpg',
      },
    ];

    it('should get products by category successfully', async () => {
      mockHttpClient.get.mockResolvedValue(mockCategoryProducts);

      const result = await productApiDataSource.getProductsByCategory('Electronics');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/category/Electronics');
      expect(result).toEqual(mockCategoryProducts);
    });

    it('should encode category name in URL', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      await productApiDataSource.getProductsByCategory('Electronics & Gadgets');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/category/Electronics%20%26%20Gadgets');
    });

    it('should handle special characters in category', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      await productApiDataSource.getProductsByCategory('Café & Restaurants');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/category/Caf%C3%A9%20%26%20Restaurants');
    });

    it('should handle AppError from HttpClient', async () => {
      const appError = new AppError('Category not found', ErrorCode.NOT_FOUND);
      mockHttpClient.get.mockRejectedValue(appError);

      await expect(productApiDataSource.getProductsByCategory('NonExistent')).rejects.toThrow(appError);
    });

    it('should wrap generic error in AppError', async () => {
      const genericError = new Error('Generic error');
      mockHttpClient.get.mockRejectedValue(genericError);

      await expect(productApiDataSource.getProductsByCategory('Electronics')).rejects.toThrow(AppError);
    });
  });

  describe('getCategories', () => {
    const mockCategories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

    it('should get categories successfully', async () => {
      mockHttpClient.get.mockResolvedValue(mockCategories);

      const result = await productApiDataSource.getCategories();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/categories');
      expect(result).toEqual(mockCategories);
    });

    it('should handle empty categories array', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      const result = await productApiDataSource.getCategories();

      expect(result).toEqual([]);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products/categories');
    });

    it('should handle AppError from HttpClient', async () => {
      const appError = new AppError('Server error', ErrorCode.NETWORK_ERROR);
      mockHttpClient.get.mockRejectedValue(appError);

      await expect(productApiDataSource.getCategories()).rejects.toThrow(appError);
    });

    it('should wrap generic error in AppError', async () => {
      const genericError = new Error('Generic error');
      mockHttpClient.get.mockRejectedValue(genericError);

      await expect(productApiDataSource.getCategories()).rejects.toThrow(AppError);
    });
  });

  describe('getProductsWithLimit', () => {
    const mockLimitedProducts: Product[] = [
      {
        id: 1,
        title: 'Limited Product 1',
        price: 99.99,
        description: 'Limited description 1',
        category: 'Electronics',
        image: 'https://example.com/limited1.jpg',
      },
    ];

    it('should get products with limit successfully', async () => {
      mockHttpClient.get.mockResolvedValue(mockLimitedProducts);

      const result = await productApiDataSource.getProductsWithLimit(5);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products', {
        params: { limit: 5 },
      });
      expect(result).toEqual(mockLimitedProducts);
    });

    it('should handle different limit values', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      await productApiDataSource.getProductsWithLimit(10);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products', {
        params: { limit: 10 },
      });

      await productApiDataSource.getProductsWithLimit(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/products', {
        params: { limit: 1 },
      });
    });

    it('should handle zero limit', async () => {
      mockHttpClient.get.mockResolvedValue([]);

      const result = await productApiDataSource.getProductsWithLimit(0);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/products', {
        params: { limit: 0 },
      });
      expect(result).toEqual([]);
    });

    it('should handle AppError from HttpClient', async () => {
      const appError = new AppError('Invalid limit', ErrorCode.VALIDATION_ERROR);
      mockHttpClient.get.mockRejectedValue(appError);

      await expect(productApiDataSource.getProductsWithLimit(-1)).rejects.toThrow(appError);
    });

    it('should wrap generic error in AppError', async () => {
      const genericError = new Error('Generic error');
      mockHttpClient.get.mockRejectedValue(genericError);

      await expect(productApiDataSource.getProductsWithLimit(5)).rejects.toThrow(AppError);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete product workflow', async () => {
      // Get all products
      const allProducts: Product[] = [
        { id: 1, title: 'Product 1', price: 99.99, description: 'Desc 1', category: 'Electronics', image: 'img1.jpg' },
        { id: 2, title: 'Product 2', price: 149.99, description: 'Desc 2', category: 'Clothing', image: 'img2.jpg' },
      ];
      mockHttpClient.get.mockResolvedValueOnce(allProducts);

      const products = await productApiDataSource.getProducts();
      expect(products).toEqual(allProducts);

      // Get specific product
      const singleProduct = allProducts[0];
      mockHttpClient.get.mockResolvedValueOnce(singleProduct);

      const product = await productApiDataSource.getProductById(1);
      expect(product).toEqual(singleProduct);

      // Get products by category
      const electronicsProducts = [allProducts[0]];
      mockHttpClient.get.mockResolvedValueOnce(electronicsProducts);

      const categoryProducts = await productApiDataSource.getProductsByCategory('Electronics');
      expect(categoryProducts).toEqual(electronicsProducts);

      // Get categories
      const categories = ['Electronics', 'Clothing'];
      mockHttpClient.get.mockResolvedValueOnce(categories);

      const categoriesResult = await productApiDataSource.getCategories();
      expect(categoriesResult).toEqual(categories);

      // Get limited products
      const limitedProducts = [allProducts[0]];
      mockHttpClient.get.mockResolvedValueOnce(limitedProducts);

      const limitedResult = await productApiDataSource.getProductsWithLimit(1);
      expect(limitedResult).toEqual(limitedProducts);
    });

    it('should handle error scenarios consistently', async () => {
      const networkError = new Error('Network error');
      
      // All methods should wrap generic errors
      mockHttpClient.get.mockRejectedValue(networkError);

      await expect(productApiDataSource.getProducts()).rejects.toThrow(AppError);
      await expect(productApiDataSource.getProductById(1)).rejects.toThrow(AppError);
      await expect(productApiDataSource.getProductsByCategory('test')).rejects.toThrow(AppError);
      await expect(productApiDataSource.getCategories()).rejects.toThrow(AppError);
      await expect(productApiDataSource.getProductsWithLimit(5)).rejects.toThrow(AppError);
    });

    it('should handle not found scenario specifically for getProductById', async () => {
      const notFoundError = new AppError('Not found', ErrorCode.NOT_FOUND);
      mockHttpClient.get.mockRejectedValue(notFoundError);

      const result = await productApiDataSource.getProductById(999);
      expect(result).toBeNull();

      // Other methods should still throw the error
      await expect(productApiDataSource.getProducts()).rejects.toThrow(notFoundError);
    });
  });
});
