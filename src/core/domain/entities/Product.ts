export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

export enum ProductEventType {
    PRODUCT_FAVORITED = 'PRODUCT_FAVORITED',
    PRODUCT_UNFAVORITED = 'PRODUCT_UNFAVORITED',
}

export interface ProductEvent {
    type: ProductEventType;
    payload: {
        userId: string;
        productId: number;
        timestamp: Date;
    };
}