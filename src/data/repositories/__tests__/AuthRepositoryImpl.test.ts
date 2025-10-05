import { AuthRepositoryImpl } from '../AuthRepositoryImpl';
import { FirebaseAuthDataSource } from '../../datasources/local/FirebaseAuthDataSource';
import { User, AuthCredentials, RegisterData } from '../../../core/domain/entities/User';
import { AppError, ErrorCode } from '../../../core/errors/AppError';

describe('AuthRepositoryImpl', () => {
  let authRepository: AuthRepositoryImpl;
  let mockFirebaseAuth: jest.Mocked<FirebaseAuthDataSource>;
  let mockUser: User;

  beforeEach(() => {
    mockFirebaseAuth = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      resetPassword: jest.fn(),
      updateProfile: jest.fn(),
    } as any;

    authRepository = new AuthRepositoryImpl(mockFirebaseAuth);

    mockUser = {
      id: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      createdAt: new Date('2023-01-01T00:00:00Z'),
    };

    jest.clearAllMocks();
  });

  describe('login', () => {
    const credentials: AuthCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      mockFirebaseAuth.login.mockResolvedValue(mockUser);

      const result = await authRepository.login(credentials);

      expect(mockFirebaseAuth.login).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when login fails', async () => {
      const error = new Error('Login failed');
      mockFirebaseAuth.login.mockRejectedValue(error);

      await expect(authRepository.login(credentials)).rejects.toThrow(AppError);
      await expect(authRepository.login(credentials)).rejects.toThrow('Falha no login');
      
      try {
        await authRepository.login(credentials);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.AUTHENTICATION_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('register', () => {
    const registerData: RegisterData = {
      email: 'newuser@example.com',
      password: 'password123',
      displayName: 'New User',
    };

    it('should register successfully', async () => {
      mockFirebaseAuth.register.mockResolvedValue(mockUser);

      const result = await authRepository.register(registerData);

      expect(mockFirebaseAuth.register).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(mockUser);
    });

    it('should throw AppError when registration fails', async () => {
      const error = new Error('Registration failed');
      mockFirebaseAuth.register.mockRejectedValue(error);

      await expect(authRepository.register(registerData)).rejects.toThrow(AppError);
      await expect(authRepository.register(registerData)).rejects.toThrow('Falha ao criar conta');
      
      try {
        await authRepository.register(registerData);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.REGISTRATION_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockFirebaseAuth.logout.mockResolvedValue(undefined);

      await authRepository.logout();

      expect(mockFirebaseAuth.logout).toHaveBeenCalledTimes(1);
    });

    it('should throw AppError when logout fails', async () => {
      const error = new Error('Logout failed');
      mockFirebaseAuth.logout.mockRejectedValue(error);

      await expect(authRepository.logout()).rejects.toThrow(AppError);
      await expect(authRepository.logout()).rejects.toThrow('Erro ao fazer logout');
      
      try {
        await authRepository.logout();
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.UNKNOWN_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      mockFirebaseAuth.getCurrentUser.mockResolvedValue(mockUser);

      const result = await authRepository.getCurrentUser();

      expect(mockFirebaseAuth.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      mockFirebaseAuth.getCurrentUser.mockResolvedValue(null);

      const result = await authRepository.getCurrentUser();

      expect(mockFirebaseAuth.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should return null when getCurrentUser throws error', async () => {
      const error = new Error('Get current user failed');
      mockFirebaseAuth.getCurrentUser.mockRejectedValue(error);

      const result = await authRepository.getCurrentUser();

      expect(mockFirebaseAuth.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('resetPassword', () => {
    const email = 'test@example.com';

    it('should reset password successfully', async () => {
      mockFirebaseAuth.resetPassword.mockResolvedValue(undefined);

      await authRepository.resetPassword(email);

      expect(mockFirebaseAuth.resetPassword).toHaveBeenCalledWith(email);
    });

    it('should throw AppError when reset password fails', async () => {
      const error = new Error('Reset password failed');
      mockFirebaseAuth.resetPassword.mockRejectedValue(error);

      await expect(authRepository.resetPassword(email)).rejects.toThrow(AppError);
      await expect(authRepository.resetPassword(email)).rejects.toThrow('Erro ao redefinir senha');
      
      try {
        await authRepository.resetPassword(email);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.AUTHENTICATION_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('updateProfile', () => {
    const userId = 'user123';
    const updateData: Partial<User> = {
      displayName: 'Updated Name',
      photoURL: 'https://example.com/new-photo.jpg',
    };

    it('should update profile successfully', async () => {
      mockFirebaseAuth.updateProfile.mockResolvedValue(undefined);

      await authRepository.updateProfile(userId, updateData);

      expect(mockFirebaseAuth.updateProfile).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw AppError when update profile fails', async () => {
      const error = new Error('Update profile failed');
      mockFirebaseAuth.updateProfile.mockRejectedValue(error);

      await expect(authRepository.updateProfile(userId, updateData)).rejects.toThrow(AppError);
      await expect(authRepository.updateProfile(userId, updateData)).rejects.toThrow('Erro ao atualizar perfil');
      
      try {
        await authRepository.updateProfile(userId, updateData);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.STORAGE_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle partial update data', async () => {
      const partialData: Partial<User> = {
        displayName: 'Only Name Updated',
      };
      mockFirebaseAuth.updateProfile.mockResolvedValue(undefined);

      await authRepository.updateProfile(userId, partialData);

      expect(mockFirebaseAuth.updateProfile).toHaveBeenCalledWith(userId, partialData);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete authentication workflow', async () => {
      const credentials: AuthCredentials = {
        email: 'integration@example.com',
        password: 'password123',
      };

      // Login
      mockFirebaseAuth.login.mockResolvedValue(mockUser);
      const loginResult = await authRepository.login(credentials);
      expect(loginResult).toEqual(mockUser);

      // Get current user
      mockFirebaseAuth.getCurrentUser.mockResolvedValue(mockUser);
      const currentUser = await authRepository.getCurrentUser();
      expect(currentUser).toEqual(mockUser);

      // Update profile
      const updateData: Partial<User> = { displayName: 'Updated Name' };
      mockFirebaseAuth.updateProfile.mockResolvedValue(undefined);
      await authRepository.updateProfile(mockUser.id, updateData);
      expect(mockFirebaseAuth.updateProfile).toHaveBeenCalledWith(mockUser.id, updateData);

      // Logout
      mockFirebaseAuth.logout.mockResolvedValue(undefined);
      await authRepository.logout();
      expect(mockFirebaseAuth.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle error scenarios consistently', async () => {
      const credentials: AuthCredentials = {
        email: 'error@example.com',
        password: 'password123',
      };

      const error = new Error('Firebase error');
      
      // All methods should wrap errors in AppError
      mockFirebaseAuth.login.mockRejectedValue(error);
      mockFirebaseAuth.register.mockRejectedValue(error);
      mockFirebaseAuth.logout.mockRejectedValue(error);
      mockFirebaseAuth.resetPassword.mockRejectedValue(error);
      mockFirebaseAuth.updateProfile.mockRejectedValue(error);

      await expect(authRepository.login(credentials)).rejects.toThrow(AppError);
      await expect(authRepository.register(credentials)).rejects.toThrow(AppError);
      await expect(authRepository.logout()).rejects.toThrow(AppError);
      await expect(authRepository.resetPassword('test@example.com')).rejects.toThrow(AppError);
      await expect(authRepository.updateProfile('user123', {})).rejects.toThrow(AppError);
    });

    it('should handle getCurrentUser error gracefully', async () => {
      const error = new Error('Network error');
      mockFirebaseAuth.getCurrentUser.mockRejectedValue(error);

      // getCurrentUser should return null instead of throwing
      const result = await authRepository.getCurrentUser();
      expect(result).toBeNull();
      expect(mockFirebaseAuth.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });
});
