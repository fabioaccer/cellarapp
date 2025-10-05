import { Product } from '../entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getByCategory(category: string): Promise<Product[]>;
  getCategories(): Promise<string[]>;
}