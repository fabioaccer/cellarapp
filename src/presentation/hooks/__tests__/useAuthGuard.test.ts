import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuthGuard } from '../useAuthGuard';
import { useAuth } from '../useAuth';

// Mock dependencies
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseCallback = useCallback as jest.MockedFunction<typeof useCallback>;
const mockUseNavigation = useNavigation as jest.MockedFunction<typeof useNavigation>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('useAuthGuard', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    createdAt: new Date('2023-01-01T00:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue(mockNavigation as any);
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });
    });

    it('should return isAuthenticated as true', () => {
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();

      expect(result.isAuthenticated).toBe(true);
    });

    it('should execute callback immediately when requireAuth is called', () => {
      const mockCallback = jest.fn();
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('should not show alert when user is authenticated', () => {
      const mockCallback = jest.fn();
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback);

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
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
    });

    it('should return isAuthenticated as false', () => {
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();

      expect(result.isAuthenticated).toBe(false);
    });

    it('should show alert with default message when requireAuth is called', () => {
      const mockCallback = jest.fn();
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Necessário',
        'Faça login para acessar esta funcionalidade',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Fazer Login',
            onPress: expect.any(Function),
          },
        ]
      );
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should show alert with custom message when provided', () => {
      const mockCallback = jest.fn();
      const customMessage = 'Custom login message';
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback, customMessage);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Login Necessário',
        customMessage,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Fazer Login',
            onPress: expect.any(Function),
          },
        ]
      );
    });

    it('should navigate to AuthStack when login button is pressed', () => {
      const mockCallback = jest.fn();
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback);

      // Get the onPress function from the alert call
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const loginButton = alertCall[2][1]; // Second button (Fazer Login)
      
      loginButton.onPress();

      expect(mockNavigation.navigate).toHaveBeenCalledWith('AuthStack');
    });

    it('should not execute callback when user is not authenticated', () => {
      const mockCallback = jest.fn();
      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();
      result.requireAuth(mockCallback);

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('useCallback behavior', () => {
    it('should use useCallback for requireAuth function', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });

      useAuthGuard();

      expect(mockUseCallback).toHaveBeenCalledTimes(1);
      expect(mockUseCallback).toHaveBeenCalledWith(
        expect.any(Function),
        [mockUser, mockNavigation]
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication flow', () => {
      // Start without user
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });

      mockUseCallback.mockImplementation((fn) => fn);
      const result = useAuthGuard();

      // Should not be authenticated
      expect(result.isAuthenticated).toBe(false);

      // Should show alert when trying to access protected function
      const mockCallback = jest.fn();
      result.requireAuth(mockCallback);
      expect(Alert.alert).toHaveBeenCalled();

      // Simulate login
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });

      const newResult = useAuthGuard();

      // Should now be authenticated
      expect(newResult.isAuthenticated).toBe(true);

      // Should execute callback immediately
      const newCallback = jest.fn();
      newResult.requireAuth(newCallback);
      expect(newCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle different callback types', () => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isLoading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
      });

      mockUseCallback.mockImplementation((fn) => fn);

      const result = useAuthGuard();

      // Test synchronous callback
      const syncCallback = jest.fn();
      result.requireAuth(syncCallback);
      expect(syncCallback).toHaveBeenCalledTimes(1);

      // Test async callback
      const asyncCallback = jest.fn().mockResolvedValue(undefined);
      result.requireAuth(asyncCallback);
      expect(asyncCallback).toHaveBeenCalledTimes(1);
    });
  });
});