import { useContext } from 'react';

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  AuthContext: {},
}));

// Mock React useContext
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

const mockUseContext = useContext as jest.MockedFunction<typeof useContext>;

// Import useAuth after mocks
const { useAuth } = require('../useAuth');

describe('useAuth', () => {
  const mockAuthContext = {
    user: {
      id: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      createdAt: new Date('2023-01-01T00:00:00Z'),
    },
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return auth context when available', () => {
    mockUseContext.mockReturnValue(mockAuthContext);

    const result = useAuth();

    expect(mockUseContext).toHaveBeenCalled();
    expect(result).toEqual(mockAuthContext);
  });

  it('should return auth context with null user', () => {
    const contextWithNullUser = {
      ...mockAuthContext,
      user: null,
    };
    mockUseContext.mockReturnValue(contextWithNullUser);

    const result = useAuth();

    expect(mockUseContext).toHaveBeenCalled();
    expect(result).toEqual(contextWithNullUser);
    expect(result.user).toBeNull();
  });

  it('should return auth context with loading state', () => {
    const contextWithLoading = {
      ...mockAuthContext,
      isLoading: true,
    };
    mockUseContext.mockReturnValue(contextWithLoading);

    const result = useAuth();

    expect(mockUseContext).toHaveBeenCalled();
    expect(result).toEqual(contextWithLoading);
    expect(result.isLoading).toBe(true);
  });

  it('should throw error when context is not available', () => {
    mockUseContext.mockReturnValue(null);

    expect(() => useAuth()).toThrow('useAuth must be used within AuthProvider');
    expect(mockUseContext).toHaveBeenCalled();
  });

  it('should throw error when context is undefined', () => {
    mockUseContext.mockReturnValue(undefined);

    expect(() => useAuth()).toThrow('useAuth must be used within AuthProvider');
    expect(mockUseContext).toHaveBeenCalled();
  });

  it('should provide all auth methods', () => {
    mockUseContext.mockReturnValue(mockAuthContext);

    const result = useAuth();

    expect(result.login).toBeDefined();
    expect(result.register).toBeDefined();
    expect(result.logout).toBeDefined();
    expect(result.resetPassword).toBeDefined();
    expect(typeof result.login).toBe('function');
    expect(typeof result.register).toBe('function');
    expect(typeof result.logout).toBe('function');
    expect(typeof result.resetPassword).toBe('function');
  });
});