import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../../presentation/navigation/types';
import { useFavorites } from '../../../presentation/hooks/useFavorites';
import { useAuthGuard } from '../../../presentation/hooks/useAuthGuard';
import { formatCurrency } from '../../../utils/formatters/formatters';
import Ionicons from '@expo/vector-icons/Ionicons';

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

type ProductDetailsRouteProp = RouteProp<MainStackParamList, 'ProductDetails'>;

interface Props {
    route: ProductDetailsRouteProp;
    navigation: any;
}

export const ProductDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { product } = route.params;
    const { isFavorite, toggleFavorite, isToggling } = useFavorites();
    const { requireAuth } = useAuthGuard();
    const favorite = isFavorite(product.id);

    const handleToggleFavorite = async () => {
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
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes do Produto</Text>
            </View>
            
            <ScrollView style={styles.container}>
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
                            size={28}
                            color={favorite ? '#FF3B30' : '#000'}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(product.category) }]}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    <Text style={styles.title}>{product.title}</Text>

                    <Text style={styles.price}>{formatCurrency(product.price)}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.descriptionTitle}>Descrição</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        height: 300,
        backgroundColor: '#F9F9F9',
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
        top: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '400',
        textTransform: 'capitalize',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#7A2EFF',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 24,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
});