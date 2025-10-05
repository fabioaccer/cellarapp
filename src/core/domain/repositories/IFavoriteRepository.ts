import { Product } from '../entities/Product';

export interface IFavoriteRepository {
  getFavorites(userId: string): Promise<Product[]>;
  isFavorite(userId: string, productId: number): Promise<boolean>;
  addFavorite(userId: string, productId: number): Promise<void>;
  removeFavorite(userId: string, productId: number): Promise<void>;
  getFavoriteIds(userId: string): Promise<number[]>;
}