import { useQuery } from '@tanstack/react-query';
import { GetProductsUseCase } from '../../core/usecases/products/GetProductsUseCase';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { ProductApiDataSource } from '../../data/datasources/remote/ProductApiDataSource';

const apiDataSource = new ProductApiDataSource();
const productRepository = new ProductRepositoryImpl(apiDataSource);
const getProductsUseCase = new GetProductsUseCase(productRepository);

export const useProducts = (category?: string) => {
    return useQuery({
        queryKey: ['products', category],
        queryFn: () => getProductsUseCase.execute(category),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => productRepository.getCategories(),
        staleTime: 30 * 60 * 1000,
    });
};
