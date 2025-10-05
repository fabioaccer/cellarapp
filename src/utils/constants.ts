import { Platform } from 'react-native';

/**
 * Constantes da aplicação
 * Centraliza valores fixos e configurações
 */

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fakestoreapi.com';
export const API_TIMEOUT = 30000; // 30 segundos

// Firebase Configuration
export const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '';
export const FIREBASE_AUTH_DOMAIN = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '';
export const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '';
export const FIREBASE_STORAGE_BUCKET = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
export const FIREBASE_MESSAGING_SENDER_ID = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '';
export const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '';

// App Configuration
export const APP_NAME = 'E-commerce App';
export const APP_VERSION = '1.0.0';

// Screen Names
export const SCREENS = {
    // Auth Stack
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',

    // Main Stack
    PRODUCTS: 'Products',
    PRODUCT_DETAILS: 'ProductDetails',
    FAVORITES: 'Favorites',
    PROFILE: 'Profile',
} as const;

// Navigation Stacks
export const STACKS = {
    AUTH: 'AuthStack',
    MAIN: 'MainStack',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    USER_TOKEN: '@user_token',
    USER_DATA: '@user_data',
    THEME: '@theme',
} as const;

// Validation
export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 50,
} as const;

// Timeouts
export const TIMEOUTS = {
    DEBOUNCE: 300,
    TOAST_DURATION: 3000,
} as const;

// Platform specific
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';