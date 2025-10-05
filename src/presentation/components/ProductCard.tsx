import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Product } from '../../core/domain/entities/Product';
import { formatCurrency } from '../../utils/formatters/formatters';
import { useFavorites } from '../../presentation/hooks/useFavorites';
import { useAuthGuard } from '../../presentation/hooks/useAuthGuard';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
        'electronics': '#FFE5E5',
        'jewelery': '#E5F9F7',
        "men's clothing": '#E5F4FF',
        "women's clothing": '#E8F5E8',
        'default': '#F0F0F0'
    };
    
    return colors[category.toLowerCase()] || colors.default;
};

interface ProductCardProps {
    product: Product;
    onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const { isFavorite, toggleFavorite, isToggling } = useFavorites();
    const { requireAuth } = useAuthGuard();
    const favorite = isFavorite(product.id);

    const handleToggleFavorite = async (e: any) => {
        e.stopPropagation();
        
        requireAuth(
            async () => {
                try {
                    await toggleFavorite(product.id);
                } catch (error) {
                    console.error('Error toggling favorite:', error);
                }
            },
            'Faça login para adicionar produtos aos favoritos'
        );
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={handleToggleFavorite}
                    disabled={isToggling}
                >
                    <Ionicons
                        name={favorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={favorite ? '#FF3B30' : '#666'}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={[styles.categoryContainer, { backgroundColor: getCategoryColor(product.category) }]}>
                    <Text style={styles.category} numberOfLines={1}>
                        {product.category}
                    </Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {product.title}
                </Text>

                <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'transparent',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
        color: '#000',
        marginBottom: 4,
        height: 40,
    },
    categoryContainer: {
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        fontWeight: '400',
        color: '#000',
        textTransform: 'capitalize',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7A2EFF',
    },
});