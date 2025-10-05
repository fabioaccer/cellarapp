import { IFavoriteRepository } from '../../core/domain/repositories/IFavoriteRepository';
import { Product } from '../../core/domain/entities/Product';
import { FirestoreDataSource } from '../datasources/local/FirestoreDataSource';
import { ProductApiDataSource } from '../datasources/remote/ProductApiDataSource';
import { AppError, ErrorCode } from '../../core/errors/AppError';


export class FavoriteRepositoryImpl implements IFavoriteRepository {
    constructor(
        private firestoreDataSource: FirestoreDataSource,
        private apiDataSource: ProductApiDataSource
    ) { }

    async getFavorites(userId: string): Promise<Product[]> {
        try {
            const favoriteIds = await this.firestoreDataSource.getFavoriteIds(userId);

            if (favoriteIds.length === 0) {
                return [];
            }

            const products = await Promise.all(
                favoriteIds.map(id => this.apiDataSource.getProductById(id))
            );

            return products.filter((p): p is Product => p !== null);
        } catch (error) {
            throw new AppError(
                'Erro ao buscar favoritos',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }

    async isFavorite(userId: string, productId: number): Promise<boolean> {
        try {
            return await this.firestoreDataSource.isFavorite(userId, productId);
        } catch (error) {
            throw new AppError(
                'Erro ao verificar favorito',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }

    async addFavorite(userId: string, productId: number): Promise<void> {
        try {
            await this.firestoreDataSource.addFavorite(userId, productId);
        } catch (error) {
            throw new AppError(
                'Erro ao adicionar favorito',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }

    async removeFavorite(userId: string, productId: number): Promise<void> {
        try {
            await this.firestoreDataSource.removeFavorite(userId, productId);
        } catch (error) {
            throw new AppError(
                'Erro ao remover favorito',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }

    async getFavoriteIds(userId: string): Promise<number[]> {
        try {
            return await this.firestoreDataSource.getFavoriteIds(userId);
        } catch (error) {
            throw new AppError(
                'Erro ao buscar IDs de favoritos',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }
}