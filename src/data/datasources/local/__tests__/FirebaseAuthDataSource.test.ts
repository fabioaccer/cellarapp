import { FirebaseAuthDataSource, AuthCredentials, RegisterData } from '../FirebaseAuthDataSource';
import { User } from '../../../../core/domain/entities/User';
import { AppError, ErrorCode, ErrorFactory } from '../../../../core/errors/AppError';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../../../infrastructure/firebase/config';

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../../../infrastructure/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
}));

// Mock ErrorFactory
jest.mock('../../../../core/errors/AppError', () => ({
  AppError: jest.fn().mockImplementation((message, code) => ({
    message,
    code,
  })),
  ErrorCode: {
    UNAUTHORIZED: 'UNAUTHORIZED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  },
  ErrorFactory: {
    handleFirebaseAuthError: jest.fn(),
    handleGenericError: jest.fn(),
  },
}));

describe('FirebaseAuthDataSource', () => {
  let authDataSource: FirebaseAuthDataSource;
  let mockFirebaseUser: any;
  let mockUserCredential: any;

  beforeEach(() => {
    authDataSource = new FirebaseAuthDataSource();
    
    mockFirebaseUser = {
      uid: 'user123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      metadata: {
        creationTime: '2023-01-01T00:00:00Z',
      },
    };

    mockUserCredential = {
      user: mockFirebaseUser,
    };

    // Reset auth.currentUser
    (auth as any).currentUser = null;
    
    jest.clearAllMocks();
  });

  describe('login', () => {
    const credentials: AuthCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await authDataSource.login(credentials);

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        credentials.email,
        credentials.password
      );
      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should handle login without displayName and photoURL', async () => {
      const userWithoutProfile = {
        ...mockFirebaseUser,
        displayName: null,
        photoURL: null,
      };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: userWithoutProfile,
      });

      const result = await authDataSource.login(credentials);

      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: undefined,
        photoURL: undefined,
        createdAt: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirebaseAuthError as jest.Mock).mockReturnValue(error);

      await expect(authDataSource.login(credentials)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirebaseAuthError).toHaveBeenCalledWith(error);
    });
  });

  describe('register', () => {
    const registerData: RegisterData = {
      email: 'newuser@example.com',
      password: 'password123',
      displayName: 'New User',
    };

    it('should register successfully with displayName', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (updateProfile as jest.Mock).mockResolvedValue(undefined);

      const result = await authDataSource.register(registerData);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        registerData.email,
        registerData.password
      );
      expect(updateProfile).toHaveBeenCalledWith(mockFirebaseUser, {
        displayName: registerData.displayName,
      });
      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should register successfully without displayName', async () => {
      const dataWithoutDisplayName: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
      };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await authDataSource.register(dataWithoutDisplayName);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        dataWithoutDisplayName.email,
        dataWithoutDisplayName.password
      );
      expect(updateProfile).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already in use');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirebaseAuthError as jest.Mock).mockReturnValue(error);

      await expect(authDataSource.register(registerData)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirebaseAuthError).toHaveBeenCalledWith(error);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await authDataSource.logout();

      expect(signOut).toHaveBeenCalledWith(auth);
    });

    it('should handle logout error', async () => {
      const error = new Error('Logout failed');
      (signOut as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleGenericError as jest.Mock).mockReturnValue(error);

      await expect(authDataSource.logout()).rejects.toThrow(error);
      expect(ErrorFactory.handleGenericError).toHaveBeenCalledWith(error, 'logout');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      (auth as any).currentUser = mockFirebaseUser;

      const result = await authDataSource.getCurrentUser();

      expect(result).toEqual({
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2023-01-01T00:00:00Z'),
      });
    });

    it('should return null when not authenticated', async () => {
      (auth as any).currentUser = null;

      const result = await authDataSource.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle user without creation time', async () => {
      const userWithoutCreationTime = {
        ...mockFirebaseUser,
        metadata: {},
      };
      (auth as any).currentUser = userWithoutCreationTime;

      const result = await authDataSource.getCurrentUser();

      expect(result?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('resetPassword', () => {
    const email = 'test@example.com';

    it('should send password reset email successfully', async () => {
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await authDataSource.resetPassword(email);

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, email);
    });

    it('should handle password reset error', async () => {
      const error = new Error('User not found');
      (sendPasswordResetEmail as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirebaseAuthError as jest.Mock).mockReturnValue(error);

      await expect(authDataSource.resetPassword(email)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirebaseAuthError).toHaveBeenCalledWith(error);
    });
  });

  describe('updateProfile', () => {
    const userId = 'user123';
    const updateData: Partial<User> = {
      displayName: 'Updated Name',
      photoURL: 'https://example.com/new-photo.jpg',
    };

    it('should update profile successfully', async () => {
      (auth as any).currentUser = mockFirebaseUser;
      (updateProfile as jest.Mock).mockResolvedValue(undefined);

      await authDataSource.updateProfile(userId, updateData);

      expect(updateProfile).toHaveBeenCalledWith(mockFirebaseUser, {
        displayName: updateData.displayName,
        photoURL: updateData.photoURL,
      });
    });

    it('should throw error when user not found', async () => {
      (auth as any).currentUser = null;

      await expect(authDataSource.updateProfile(userId, updateData)).rejects.toThrow();
      expect(updateProfile).not.toHaveBeenCalled();
    });

    it('should throw error when user ID does not match', async () => {
      (auth as any).currentUser = mockFirebaseUser;

      await expect(authDataSource.updateProfile('different-user-id', updateData)).rejects.toThrow();
      expect(updateProfile).not.toHaveBeenCalled();
    });

    it('should handle update profile error', async () => {
      (auth as any).currentUser = mockFirebaseUser;
      const error = new Error('Update failed');
      (updateProfile as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleGenericError as jest.Mock).mockReturnValue(error);

      await expect(authDataSource.updateProfile(userId, updateData)).rejects.toThrow(error);
      expect(ErrorFactory.handleGenericError).toHaveBeenCalledWith(error, 'atualização de perfil');
    });

    it('should handle partial update data', async () => {
      (auth as any).currentUser = mockFirebaseUser;
      const partialData: Partial<User> = {
        displayName: 'Only Name Updated',
      };
      (updateProfile as jest.Mock).mockResolvedValue(undefined);

      await authDataSource.updateProfile(userId, partialData);

      expect(updateProfile).toHaveBeenCalledWith(mockFirebaseUser, {
        displayName: partialData.displayName,
        photoURL: undefined,
      });
    });
  });

  describe('mapFirebaseUser', () => {
    it('should map Firebase user correctly', async () => {
      // Test through getCurrentUser method
      (auth as any).currentUser = mockFirebaseUser;

      const result = await authDataSource.getCurrentUser();

      expect(result).toEqual({
        id: mockFirebaseUser.uid,
        email: mockFirebaseUser.email,
        displayName: mockFirebaseUser.displayName,
        photoURL: mockFirebaseUser.photoURL,
        createdAt: new Date(mockFirebaseUser.metadata.creationTime),
      });
    });

    it('should handle null displayName and photoURL', async () => {
      const userWithNulls = {
        ...mockFirebaseUser,
        displayName: null,
        photoURL: null,
      };
      (auth as any).currentUser = userWithNulls;

      const result = await authDataSource.getCurrentUser();

      expect(result?.displayName).toBeUndefined();
      expect(result?.photoURL).toBeUndefined();
    });
  });
});
