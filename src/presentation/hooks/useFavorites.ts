import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetFavoritesUseCase } from '../../core/usecases/favorites/GetFavoritesUseCase';
import { ToggleFavoriteUseCase } from '../../core/usecases/favorites/ToggleFavoriteUseCase';
import { FavoriteRepositoryImpl } from '../../data/repositories/FavoriteRepositoryImpl';
import { FirestoreDataSource } from '../../data/datasources/local/FirestoreDataSource';
import { ProductApiDataSource } from '../../data/datasources/remote/ProductApiDataSource';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

const firestoreDataSource = new FirestoreDataSource();
const apiDataSource = new ProductApiDataSource();
const favoriteRepository = new FavoriteRepositoryImpl(firestoreDataSource, apiDataSource);
const getFavoritesUseCase = new GetFavoritesUseCase(favoriteRepository);
const toggleFavoriteUseCase = new ToggleFavoriteUseCase(favoriteRepository);

export const useFavorites = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const favoritesQuery = useQuery({
        queryKey: ['favorites', user?.id],
        queryFn: () => getFavoritesUseCase.execute(user!.id),
        enabled: !!user,
        staleTime: 2 * 60 * 1000,
    });

    const toggleMutation = useMutation({
        mutationFn: (productId: number) =>
            toggleFavoriteUseCase.execute(user!.id, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
        },
    });

    const isFavorite = useCallback(
        (productId: number): boolean => {
            if (!favoritesQuery.data) return false;
            return favoritesQuery.data.some(p => p.id === productId);
        },
        [favoritesQuery.data]
    );

    const toggleFavorite = useCallback(
        async (productId: number) => {
            if (!user) return;

            const previousFavorites = queryClient.getQueryData(['favorites', user.id]);

            queryClient.setQueryData(['favorites', user.id], (old: any) => {
                if (!old) return old;
                const isFav = old.some((p: any) => p.id === productId);
                if (isFav) {
                    return old.filter((p: any) => p.id !== productId);
                }
                return old;
            });

            try {
                await toggleMutation.mutateAsync(productId);
            } catch (error) {
                queryClient.setQueryData(['favorites', user.id], previousFavorites);
                throw error;
            }
        },
        [user, queryClient, toggleMutation]
    );

    return {
        favorites: favoritesQuery.data || [],
        isLoading: favoritesQuery.isLoading,
        error: favoritesQuery.error,
        isFavorite,
        toggleFavorite,
        isToggling: toggleMutation.isPending,
    };
};