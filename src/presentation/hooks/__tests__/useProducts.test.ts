import { useQuery } from '@tanstack/react-query';
import { useProducts, useCategories } from '../useProducts';
import { GetProductsUseCase } from '../../../core/usecases/products/GetProductsUseCase';
import { ProductRepositoryImpl } from '../../../data/repositories/ProductRepositoryImpl';
import { ProductApiDataSource } from '../../../data/datasources/remote/ProductApiDataSource';

// Mock dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../../core/usecases/products/GetProductsUseCase');
jest.mock('../../../data/repositories/ProductRepositoryImpl');
jest.mock('../../../data/datasources/remote/ProductApiDataSource');

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('useProducts', () => {
  const mockProducts = [
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

  const mockQueryResult = {
    data: mockProducts,
    isLoading: false,
    error: null,
    isError: false,
    isSuccess: true,
    refetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQuery.mockReturnValue(mockQueryResult as any);
  });

  describe('useProducts', () => {
    it('should call useQuery with correct parameters for all products', () => {
      useProducts();

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', undefined],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    });

    it('should call useQuery with correct parameters for category products', () => {
      const category = 'Electronics';
      useProducts(category);

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', category],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    });

    it('should return query result', () => {
      const result = useProducts();

      expect(result).toEqual(mockQueryResult);
    });

    it('should handle different categories', () => {
      const electronicsCategory = 'Electronics';
      const clothingCategory = 'Clothing';

      useProducts(electronicsCategory);
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', electronicsCategory],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });

      useProducts(clothingCategory);
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', clothingCategory],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    });

    it('should handle loading state', () => {
      const loadingResult = {
        ...mockQueryResult,
        isLoading: true,
        isSuccess: false,
      };
      mockUseQuery.mockReturnValue(loadingResult as any);

      const result = useProducts();

      expect(result.isLoading).toBe(true);
      expect(result.isSuccess).toBe(false);
    });

    it('should handle error state', () => {
      const error = new Error('Failed to fetch products');
      const errorResult = {
        ...mockQueryResult,
        error,
        isError: true,
        isSuccess: false,
      };
      mockUseQuery.mockReturnValue(errorResult as any);

      const result = useProducts();

      expect(result.error).toBe(error);
      expect(result.isError).toBe(true);
      expect(result.isSuccess).toBe(false);
    });

    it('should handle empty data', () => {
      const emptyResult = {
        ...mockQueryResult,
        data: [],
      };
      mockUseQuery.mockReturnValue(emptyResult as any);

      const result = useProducts();

      expect(result.data).toEqual([]);
    });

    it('should handle undefined category', () => {
      useProducts(undefined);

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', undefined],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    });

    it('should handle empty string category', () => {
      useProducts('');

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', ''],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });
    });
  });

  describe('useCategories', () => {
    const mockCategories = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];

    const mockCategoriesResult = {
      data: mockCategories,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: jest.fn(),
    };

    beforeEach(() => {
      mockUseQuery.mockReturnValue(mockCategoriesResult as any);
    });

    it('should call useQuery with correct parameters', () => {
      useCategories();

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['categories'],
        queryFn: expect.any(Function),
        staleTime: 30 * 60 * 1000,
      });
    });

    it('should return categories query result', () => {
      const result = useCategories();

      expect(result).toEqual(mockCategoriesResult);
    });

    it('should handle loading state', () => {
      const loadingResult = {
        ...mockCategoriesResult,
        isLoading: true,
        isSuccess: false,
      };
      mockUseQuery.mockReturnValue(loadingResult as any);

      const result = useCategories();

      expect(result.isLoading).toBe(true);
      expect(result.isSuccess).toBe(false);
    });

    it('should handle error state', () => {
      const error = new Error('Failed to fetch categories');
      const errorResult = {
        ...mockCategoriesResult,
        error,
        isError: true,
        isSuccess: false,
      };
      mockUseQuery.mockReturnValue(errorResult as any);

      const result = useCategories();

      expect(result.error).toBe(error);
      expect(result.isError).toBe(true);
      expect(result.isSuccess).toBe(false);
    });

    it('should handle empty categories', () => {
      const emptyResult = {
        ...mockCategoriesResult,
        data: [],
      };
      mockUseQuery.mockReturnValue(emptyResult as any);

      const result = useCategories();

      expect(result.data).toEqual([]);
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple product queries with different categories', () => {
      // Query all products
      useProducts();
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', undefined],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });

      // Query electronics products
      useProducts('Electronics');
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['products', 'Electronics'],
        queryFn: expect.any(Function),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      });

      // Query categories
      useCategories();
      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['categories'],
        queryFn: expect.any(Function),
        staleTime: 30 * 60 * 1000,
      });
    });

    it('should handle different query states', () => {
      // Test loading state
      const loadingResult = {
        ...mockQueryResult,
        isLoading: true,
        isSuccess: false,
      };
      mockUseQuery.mockReturnValue(loadingResult as any);

      const loadingResult_hook = useProducts();
      expect(loadingResult_hook.isLoading).toBe(true);

      // Test success state
      const successResult = {
        ...mockQueryResult,
        isLoading: false,
        isSuccess: true,
        data: mockProducts,
      };
      mockUseQuery.mockReturnValue(successResult as any);

      const successResult_hook = useProducts();
      expect(successResult_hook.isSuccess).toBe(true);
      expect(successResult_hook.data).toEqual(mockProducts);

      // Test error state
      const error = new Error('Network error');
      const errorResult = {
        ...mockQueryResult,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error,
      };
      mockUseQuery.mockReturnValue(errorResult as any);

      const errorResult_hook = useProducts();
      expect(errorResult_hook.isError).toBe(true);
      expect(errorResult_hook.error).toBe(error);
    });

    it('should handle refetch functionality', () => {
      const mockRefetch = jest.fn();
      const resultWithRefetch = {
        ...mockQueryResult,
        refetch: mockRefetch,
      };
      mockUseQuery.mockReturnValue(resultWithRefetch as any);

      const result = useProducts();

      expect(result.refetch).toBe(mockRefetch);
      expect(typeof result.refetch).toBe('function');
    });
  });
});