import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    getDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../infrastructure/firebase/config';
import { AppError, ErrorCode, ErrorFactory } from '../../../core/errors/AppError';

export class FirestoreDataSource {
    private readonly COLLECTION = 'favorites';

    async getFavoriteIds(userId: string): Promise<number[]> {
        try {
            const favoritesRef = collection(db, this.COLLECTION, userId, 'products');
            const snapshot = await getDocs(favoritesRef);
            return snapshot.docs.map(doc => doc.data().productId as number);
        } catch (error) {
            throw ErrorFactory.handleFirestoreError(error);
        }
    }

    async isFavorite(userId: string, productId: number): Promise<boolean> {
        try {
            const docRef = doc(db, this.COLLECTION, userId, 'products', productId.toString());
            const docSnap = await getDoc(docRef);
            return docSnap.exists();
        } catch (error) {
            throw ErrorFactory.handleFirestoreError(error);
        }
    }

    async addFavorite(userId: string, productId: number): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION, userId, 'products', productId.toString());
            await setDoc(docRef, {
                productId,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            throw ErrorFactory.handleFirestoreError(error);
        }
    }

    async removeFavorite(userId: string, productId: number): Promise<void> {
        try {
            const docRef = doc(db, this.COLLECTION, userId, 'products', productId.toString());
            await deleteDoc(docRef);
        } catch (error) {
            throw ErrorFactory.handleFirestoreError(error);
        }
    }

    async clearFavorites(userId: string): Promise<void> {
        try {
            const favoritesRef = collection(db, this.COLLECTION, userId, 'products');
            const snapshot = await getDocs(favoritesRef);

            const deletePromises = snapshot.docs.map(document => deleteDoc(document.ref));
            await Promise.all(deletePromises);
        } catch (error) {
            throw ErrorFactory.handleFirestoreError(error);
        }
    }
}