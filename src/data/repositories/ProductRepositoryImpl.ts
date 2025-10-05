import { IProductRepository } from '../../core/domain/repositories/IProductRepository';
import { Product } from '../../core/domain/entities/Product';
import { ProductApiDataSource } from '../datasources/remote/ProductApiDataSource';
import { AppError, ErrorCode } from '../../core/errors/AppError';

export class ProductRepositoryImpl implements IProductRepository {
    constructor(private apiDataSource: ProductApiDataSource) { }

    async getAll(): Promise<Product[]> {
        try {
            return await this.apiDataSource.getProducts();
        } catch (error) {
            throw new AppError(
                'Erro ao buscar produtos',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getById(id: number): Promise<Product | null> {
        try {
            return await this.apiDataSource.getProductById(id);
        } catch (error) {
            if (error instanceof AppError && error.code === ErrorCode.NOT_FOUND) {
                return null;
            }
            throw new AppError(
                'Erro ao buscar produto',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getByCategory(category: string): Promise<Product[]> {
        try {
            return await this.apiDataSource.getProductsByCategory(category);
        } catch (error) {
            throw new AppError(
                'Erro ao buscar produtos por categoria',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getCategories(): Promise<string[]> {
        try {
            return await this.apiDataSource.getCategories();
        } catch (error) {
            throw new AppError(
                'Erro ao buscar categorias',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }
}