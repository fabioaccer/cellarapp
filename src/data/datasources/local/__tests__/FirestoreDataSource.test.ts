import { FirestoreDataSource } from '../FirestoreDataSource';
import { AppError, ErrorCode, ErrorFactory } from '../../../../core/errors/AppError';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../../infrastructure/firebase/config';

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../../../infrastructure/firebase/config', () => ({
  db: {},
}));

// Mock ErrorFactory
jest.mock('../../../../core/errors/AppError', () => ({
  AppError: jest.fn().mockImplementation((message, code) => ({
    message,
    code,
  })),
  ErrorCode: {
    FIRESTORE_ERROR: 'FIRESTORE_ERROR',
  },
  ErrorFactory: {
    handleFirestoreError: jest.fn(),
  },
}));

describe('FirestoreDataSource', () => {
  let firestoreDataSource: FirestoreDataSource;
  let mockDocRef: any;
  let mockCollectionRef: any;
  let mockDocSnap: any;
  let mockQuerySnapshot: any;

  beforeEach(() => {
    firestoreDataSource = new FirestoreDataSource();
    
    mockDocRef = {
      id: 'doc123',
    };
    
    mockCollectionRef = {
      id: 'collection123',
    };
    
    mockDocSnap = {
      exists: jest.fn(),
      data: jest.fn(),
    };
    
    mockQuerySnapshot = {
      docs: [],
    };

    jest.clearAllMocks();
  });

  describe('getFavoriteIds', () => {
    const userId = 'user123';

    it('should get favorite IDs successfully', async () => {
      const mockDocs = [
        { data: () => ({ productId: 1 }) },
        { data: () => ({ productId: 2 }) },
        { data: () => ({ productId: 3 }) },
      ];
      
      mockQuerySnapshot.docs = mockDocs;
      
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await firestoreDataSource.getFavoriteIds(userId);

      expect(collection).toHaveBeenCalledWith(db, 'favorites', userId, 'products');
      expect(getDocs).toHaveBeenCalledWith(mockCollectionRef);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when no favorites exist', async () => {
      mockQuerySnapshot.docs = [];
      
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      const result = await firestoreDataSource.getFavoriteIds(userId);

      expect(result).toEqual([]);
    });

    it('should handle Firestore error', async () => {
      const error = new Error('Firestore error');
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirestoreError as jest.Mock).mockReturnValue(error);

      await expect(firestoreDataSource.getFavoriteIds(userId)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirestoreError).toHaveBeenCalledWith(error);
    });
  });

  describe('isFavorite', () => {
    const userId = 'user123';
    const productId = 456;

    it('should return true when favorite exists', async () => {
      mockDocSnap.exists.mockReturnValue(true);
      
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await firestoreDataSource.isFavorite(userId, productId);

      expect(doc).toHaveBeenCalledWith(db, 'favorites', userId, 'products', '456');
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(true);
    });

    it('should return false when favorite does not exist', async () => {
      mockDocSnap.exists.mockReturnValue(false);
      
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);

      const result = await firestoreDataSource.isFavorite(userId, productId);

      expect(result).toBe(false);
    });

    it('should handle Firestore error', async () => {
      const error = new Error('Firestore error');
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirestoreError as jest.Mock).mockReturnValue(error);

      await expect(firestoreDataSource.isFavorite(userId, productId)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirestoreError).toHaveBeenCalledWith(error);
    });
  });

  describe('addFavorite', () => {
    const userId = 'user123';
    const productId = 789;

    it('should add favorite successfully', async () => {
      const mockTimestamp = { seconds: 1234567890 };
      (serverTimestamp as jest.Mock).mockReturnValue(mockTimestamp);
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (setDoc as jest.Mock).mockResolvedValue(undefined);

      await firestoreDataSource.addFavorite(userId, productId);

      expect(doc).toHaveBeenCalledWith(db, 'favorites', userId, 'products', '789');
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
        productId,
        createdAt: mockTimestamp,
      });
    });

    it('should handle Firestore error', async () => {
      const error = new Error('Firestore error');
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (setDoc as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirestoreError as jest.Mock).mockReturnValue(error);

      await expect(firestoreDataSource.addFavorite(userId, productId)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirestoreError).toHaveBeenCalledWith(error);
    });
  });

  describe('removeFavorite', () => {
    const userId = 'user123';
    const productId = 101112;

    it('should remove favorite successfully', async () => {
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await firestoreDataSource.removeFavorite(userId, productId);

      expect(doc).toHaveBeenCalledWith(db, 'favorites', userId, 'products', '101112');
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should handle Firestore error', async () => {
      const error = new Error('Firestore error');
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (deleteDoc as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirestoreError as jest.Mock).mockReturnValue(error);

      await expect(firestoreDataSource.removeFavorite(userId, productId)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirestoreError).toHaveBeenCalledWith(error);
    });
  });

  describe('clearFavorites', () => {
    const userId = 'user123';

    it('should clear all favorites successfully', async () => {
      const mockDoc1 = { ref: { id: 'doc1' } };
      const mockDoc2 = { ref: { id: 'doc2' } };
      const mockDoc3 = { ref: { id: 'doc3' } };
      
      mockQuerySnapshot.docs = [mockDoc1, mockDoc2, mockDoc3];
      
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);

      await firestoreDataSource.clearFavorites(userId);

      expect(collection).toHaveBeenCalledWith(db, 'favorites', userId, 'products');
      expect(getDocs).toHaveBeenCalledWith(mockCollectionRef);
      expect(deleteDoc).toHaveBeenCalledTimes(3);
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc1.ref);
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc2.ref);
      expect(deleteDoc).toHaveBeenCalledWith(mockDoc3.ref);
    });

    it('should handle empty favorites list', async () => {
      mockQuerySnapshot.docs = [];
      
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);

      await firestoreDataSource.clearFavorites(userId);

      expect(collection).toHaveBeenCalledWith(db, 'favorites', userId, 'products');
      expect(getDocs).toHaveBeenCalledWith(mockCollectionRef);
      expect(deleteDoc).not.toHaveBeenCalled();
    });

    it('should handle Firestore error during getDocs', async () => {
      const error = new Error('Firestore error');
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockRejectedValue(error);
      (ErrorFactory.handleFirestoreError as jest.Mock).mockReturnValue(error);

      await expect(firestoreDataSource.clearFavorites(userId)).rejects.toThrow(error);
      expect(ErrorFactory.handleFirestoreError).toHaveBeenCalledWith(error);
    });

    it('should handle Firestore error during deleteDoc', async () => {
      const mockDoc = { ref: { id: 'doc1' } };
      mockQuerySnapshot.docs = [mockDoc];
      
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);
      (deleteDoc as jest.Mock).mockRejectedValue(new Error('Delete error'));
      (ErrorFactory.handleFirestoreError as jest.Mock).mockImplementation((error) => error);

      await expect(firestoreDataSource.clearFavorites(userId)).rejects.toThrow('Delete error');
    });
  });

  describe('integration scenarios', () => {
    const userId = 'user123';
    const productId = 999;

    it('should handle complete favorite workflow', async () => {
      // Check if favorite exists (false)
      mockDocSnap.exists.mockReturnValue(false);
      (doc as jest.Mock).mockReturnValue(mockDocRef);
      (getDoc as jest.Mock).mockResolvedValue(mockDocSnap);
      
      const isFavoriteBefore = await firestoreDataSource.isFavorite(userId, productId);
      expect(isFavoriteBefore).toBe(false);

      // Add favorite
      const mockTimestamp = { seconds: 1234567890 };
      (serverTimestamp as jest.Mock).mockReturnValue(mockTimestamp);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      
      await firestoreDataSource.addFavorite(userId, productId);
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
        productId,
        createdAt: mockTimestamp,
      });

      // Check if favorite exists (true)
      mockDocSnap.exists.mockReturnValue(true);
      const isFavoriteAfter = await firestoreDataSource.isFavorite(userId, productId);
      expect(isFavoriteAfter).toBe(true);

      // Remove favorite
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);
      await firestoreDataSource.removeFavorite(userId, productId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should handle multiple favorites management', async () => {
      // Get initial favorites (empty)
      mockQuerySnapshot.docs = [];
      (collection as jest.Mock).mockReturnValue(mockCollectionRef);
      (getDocs as jest.Mock).mockResolvedValue(mockQuerySnapshot);
      
      const initialFavorites = await firestoreDataSource.getFavoriteIds(userId);
      expect(initialFavorites).toEqual([]);

      // Add multiple favorites
      const mockTimestamp = { seconds: 1234567890 };
      (serverTimestamp as jest.Mock).mockReturnValue(mockTimestamp);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      
      await firestoreDataSource.addFavorite(userId, 1);
      await firestoreDataSource.addFavorite(userId, 2);
      await firestoreDataSource.addFavorite(userId, 3);

      // Get updated favorites
      const mockDocs = [
        { data: () => ({ productId: 1 }) },
        { data: () => ({ productId: 2 }) },
        { data: () => ({ productId: 3 }) },
      ];
      mockQuerySnapshot.docs = mockDocs;
      
      const updatedFavorites = await firestoreDataSource.getFavoriteIds(userId);
      expect(updatedFavorites).toEqual([1, 2, 3]);

      // Clear all favorites
      (deleteDoc as jest.Mock).mockResolvedValue(undefined);
      await firestoreDataSource.clearFavorites(userId);
      expect(deleteDoc).toHaveBeenCalledTimes(3);
    });
  });
});
