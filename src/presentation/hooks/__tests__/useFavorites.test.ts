import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Mock all dependencies
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../core/usecases/favorites/GetFavoritesUseCase');
jest.mock('../../../core/usecases/favorites/ToggleFavoriteUseCase');
jest.mock('../../../data/repositories/FavoriteRepositoryImpl');
jest.mock('../../../data/datasources/local/FirestoreDataSource');
jest.mock('../../../data/datasources/remote/ProductApiDataSource');
jest.mock('../../../infrastructure/firebase/config', () => ({}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation>;
const mockUseQueryClient = useQueryClient as jest.MockedFunction<typeof useQueryClient>;
const mockUseCallback = useCallback as jest.MockedFunction<typeof useCallback>;
const mockUseAuth = require('../useAuth').useAuth as jest.MockedFunction<any>;

// Import useFavorites after mocks
const { useFavorites } = require('../useFavorites');

describe('useFavorites', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    createdAt: new Date('2023-01-01T00:00:00Z'),
  };

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

  const mockQueryClient = {
    invalidateQueries: jest.fn(),
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
  };

  const mockFavoritesQuery = {
    data: mockProducts,
    isLoading: false,
    error: null,
  };

  const mockToggleMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      resetPassword: jest.fn(),
    });

    mockUseQueryClient.mockReturnValue(mockQueryClient as any);
    mockUseQuery.mockReturnValue(mockFavoritesQuery as any);
    mockUseMutation.mockReturnValue(mockToggleMutation as any);
    mockUseCallback.mockImplementation((fn) => fn);
  });

  describe('when user is authenticated', () => {
    it('should return favorites data', () => {
      const result = useFavorites();

      expect(result.favorites).toEqual(mockProducts);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should setup favorites query with correct parameters', () => {
      useFavorites();

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['favorites', mockUser.id],
        queryFn: expect.any(Function),
        enabled: true,
        staleTime: 2 * 60 * 1000,
      });
    });

    it('should setup toggle mutation with correct parameters', () => {
      useFavorites();

      expect(mockUseMutation).toHaveBeenCalledWith({
        mutationFn: expect.any(Function),
        onSuccess: expect.any(Function),
      });
    });

    it('should check if product is favorite correctly', () => {
      const result = useFavorites();

      expect(result.isFavorite(1)).toBe(true);
      expect(result.isFavorite(2)).toBe(true);
      expect(result.isFavorite(999)).toBe(false);
    });

    it('should return isToggling state', () => {
      const result = useFavorites();

      expect(result.isToggling).toBe(false);
    });

    it('should handle toggle favorite successfully', async () => {
      const result = useFavorites();

      await result.toggleFavorite(1);

      expect(mockToggleMutation.mutateAsync).toHaveBeenCalledWith(1);
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });
      
      // Mock useQuery to return empty data when user is null
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      } as any);
    });

    it('should setup favorites query as disabled', () => {
      useFavorites();

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['favorites', undefined],
        queryFn: expect.any(Function),
        enabled: false,
        staleTime: 2 * 60 * 1000,
      });
    });

    it('should return empty favorites array', () => {
      const result = useFavorites();

      expect(result.favorites).toEqual([]);
    });

    it('should not execute toggle favorite when user is not authenticated', async () => {
      const result = useFavorites();

      await result.toggleFavorite(1);

      expect(mockToggleMutation.mutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('loading and error states', () => {
    it('should handle loading state', () => {
      mockUseQuery.mockReturnValue({
        ...mockFavoritesQuery,
        isLoading: true,
      } as any);

      const result = useFavorites();

      expect(result.isLoading).toBe(true);
    });

    it('should handle error state', () => {
      const error = new Error('Failed to fetch favorites');
      mockUseQuery.mockReturnValue({
        ...mockFavoritesQuery,
        error,
      } as any);

      const result = useFavorites();

      expect(result.error).toBe(error);
    });

    it('should handle pending toggle state', () => {
      mockUseMutation.mockReturnValue({
        ...mockToggleMutation,
        isPending: true,
      } as any);

      const result = useFavorites();

      expect(result.isToggling).toBe(true);
    });
  });

  describe('useCallback behavior', () => {
    it('should use useCallback for isFavorite function', () => {
      useFavorites();

      expect(mockUseCallback).toHaveBeenCalledWith(
        expect.any(Function),
        [mockProducts]
      );
    });

    it('should use useCallback for toggleFavorite function', () => {
      useFavorites();

      expect(mockUseCallback).toHaveBeenCalledWith(
        expect.any(Function),
        [mockUser, mockQueryClient, mockToggleMutation]
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete favorites workflow', async () => {
      const result = useFavorites();

      // Check initial state
      expect(result.favorites).toEqual(mockProducts);
      expect(result.isFavorite(1)).toBe(true);

      // Toggle favorite
      await result.toggleFavorite(1);

      expect(mockToggleMutation.mutateAsync).toHaveBeenCalledWith(1);
    });

    it('should handle multiple toggle operations', async () => {
      const result = useFavorites();

      // Toggle multiple products
      await result.toggleFavorite(1);
      await result.toggleFavorite(2);

      expect(mockToggleMutation.mutateAsync).toHaveBeenCalledTimes(2);
      expect(mockToggleMutation.mutateAsync).toHaveBeenNthCalledWith(1, 1);
      expect(mockToggleMutation.mutateAsync).toHaveBeenNthCalledWith(2, 2);
    });

    it('should handle empty favorites list', () => {
      mockUseQuery.mockReturnValue({
        ...mockFavoritesQuery,
        data: [],
      } as any);

      const result = useFavorites();

      expect(result.favorites).toEqual([]);
      expect(result.isFavorite(1)).toBe(false);
      expect(result.isFavorite(2)).toBe(false);
    });
  });
});