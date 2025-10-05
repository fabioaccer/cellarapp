import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts, useCategories } from '../../../presentation/hooks/useProducts';
import { ProductCard } from '../../../presentation/components/ProductCard';
import { Product } from '../../../core/domain/entities/Product';

export const ProductListScreen: React.FC<{ navigation: any }> = ({
    navigation,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

    const { data: products, isLoading, error, refetch } = useProducts(selectedCategory);
    const { data: categories } = useCategories();

    const handleProductPress = (product: Product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.title}>Produtos</Text>
            {categories && categories.length > 0 && (
                <View style={styles.categoriesContainer}>
                    <TouchableOpacity
                        style={[
                            styles.categoryChip,
                            !selectedCategory && styles.categoryChipActive,
                        ]}
                        onPress={() => setSelectedCategory(undefined)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                !selectedCategory && styles.categoryTextActive,
                            ]}
                        >
                            Todos
                        </Text>
                    </TouchableOpacity>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Erro ao carregar produtos</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>CELLAR</Text>
                {categories && categories.length > 0 && (
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesScroll}
                        contentContainerStyle={[styles.categoriesContainer, { paddingHorizontal: 20 }]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                !selectedCategory && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(undefined)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    !selectedCategory && styles.categoryTextActive,
                                ]}
                            >
                                Todos
                            </Text>
                        </TouchableOpacity>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === category && styles.categoryChipActive,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        selectedCategory === category && styles.categoryTextActive,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
            <View style={styles.container}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ProductCard product={item} onPress={() => handleProductPress(item)} />
                    )}
                    contentContainerStyle={styles.listContent}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    ListEmptyComponent={
                        isLoading ? (
                            <ActivityIndicator size="large" color="#7A2EFF" style={styles.loader} />
                        ) : (
                            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
                        )
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={refetch}
                            tintColor="#7A2EFF"
                        />
                    }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#48109C',
    },
    headerContainer: {
        backgroundColor: '#48109C',
        paddingVertical: 16,
        elevation: 0,
        shadowOpacity: 0,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    categoriesScroll: {
        marginTop: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        padding: 16,
        backgroundColor: '#7A2EFF',
        marginBottom: 8,
        elevation: 0,
        shadowOpacity: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    categoriesContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#DDD',
    },
    categoryChipActive: {
        backgroundColor: '#7A2EFF',
        borderColor: '#7A2EFF',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    categoryTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 16,
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    loader: {
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});