import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../../presentation/hooks/useFavorites';
import { ProductCard } from '../../../presentation/components/ProductCard';
import { Product } from '../../../core/domain/entities/Product';
import { AuthGuard } from '../../../presentation/components/AuthGuard';
import Ionicons from '@expo/vector-icons/Ionicons';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { favorites, isLoading, error } = useFavorites();

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
            <Text style={styles.emptySubtitle}>
                Adicione produtos aos favoritos para vê-los aqui
            </Text>
        </View>
    );

    const renderFavoritesContent = () => {
        if (error) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Erro ao carregar favoritos</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea} edges={['top']}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Meus Favoritos</Text>
                        {favorites.length > 0 && (
                            <Text style={styles.headerSubtitle}>{favorites.length} produtos</Text>
                        )}
                    </View>
                </SafeAreaView>
                
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    ListEmptyComponent={
                        isLoading ? (
                            <ActivityIndicator
                                size="large"
                                color="#7A2EFF"
                                style={styles.loader}
                            />
                        ) : (
                            renderEmptyState()
                        )
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            tintColor="#7A2EFF"
                        />
                    }
                />
            </View>
        );
    };

    return (
        <AuthGuard>
            {renderFavoritesContent()}
        </AuthGuard>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        backgroundColor: '#48109C',
    },
    headerContainer: {
        backgroundColor: '#48109C',
        paddingVertical: 16,
        elevation: 0,
        shadowOpacity: 0,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.8,
        marginTop: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContent: {
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 16,
        flexGrow: 1,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    loader: {
        marginTop: 50,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
    },
});