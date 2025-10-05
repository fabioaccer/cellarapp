import { NavigatorScreenParams } from '@react-navigation/native';
import { Product } from '../../core/domain/entities/Product';

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
};

export type MainStackParamList = {
    ProductList: undefined;
    ProductDetails: { product: Product };
    Favorites: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    AuthStack: NavigatorScreenParams<AuthStackParamList>;
    MainStack: NavigatorScreenParams<MainStackParamList>;
};
