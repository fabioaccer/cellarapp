import { Product } from '../../../core/domain/entities/Product';
import { AppError, ErrorCode } from '../../../core/errors/AppError';
import { HttpClient } from '../../../infrastructure/http/HttpClient';

export class ProductApiDataSource {
    private httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient();
    }

    async getProducts(): Promise<Product[]> {
        try {
            return await this.httpClient.get<Product[]>('/products');
        } catch (error) {
            throw error instanceof AppError ? error : new AppError(
                'Erro ao buscar produtos',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getProductById(id: number): Promise<Product | null> {
        try {
            return await this.httpClient.get<Product>(`/products/${id}`);
        } catch (error) {
            if (error instanceof AppError && error.code === ErrorCode.NOT_FOUND) {
                return null;
            }
            throw error instanceof AppError ? error : new AppError(
                'Erro ao buscar produto',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            return await this.httpClient.get<Product[]>(
                `/products/category/${encodeURIComponent(category)}`
            );
        } catch (error) {
            throw error instanceof AppError ? error : new AppError(
                'Erro ao buscar produtos por categoria',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getCategories(): Promise<string[]> {
        try {
            return await this.httpClient.get<string[]>('/products/categories');
        } catch (error) {
            throw error instanceof AppError ? error : new AppError(
                'Erro ao buscar categorias',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }

    async getProductsWithLimit(limit: number): Promise<Product[]> {
        try {
            return await this.httpClient.get<Product[]>('/products', {
                params: { limit },
            });
        } catch (error) {
            throw error instanceof AppError ? error : new AppError(
                'Erro ao buscar produtos com limite',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }
    }
}