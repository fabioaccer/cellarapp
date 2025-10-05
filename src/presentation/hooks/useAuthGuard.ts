import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainStack'>;

export const useAuthGuard = () => {
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp>();

    const requireAuth = useCallback((
        callback: () => void | Promise<void>,
        message?: string
    ) => {
        if (user) {
            callback();
            return;
        }

        const defaultMessage = 'Faça login para acessar esta funcionalidade';
        
        Alert.alert(
            'Login Necessário',
            message || defaultMessage,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Fazer Login',
                    onPress: () => navigation.navigate('AuthStack' as any),
                },
            ]
        );
    }, [user, navigation]);

    return {
        requireAuth,
        isAuthenticated: !!user,
    };
};
