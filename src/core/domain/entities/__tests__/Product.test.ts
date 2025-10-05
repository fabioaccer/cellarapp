import { Product, ProductEventType, ProductEvent } from '../Product';

describe('Product Entity', () => {
  describe('Product interface', () => {
    it('should create a valid Product object', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        category: 'Electronics',
        image: 'https://example.com/image.jpg'
      };

      expect(product.id).toBe(1);
      expect(product.title).toBe('Test Product');
      expect(product.price).toBe(99.99);
      expect(product.description).toBe('Test description');
      expect(product.category).toBe('Electronics');
      expect(product.image).toBe('https://example.com/image.jpg');
    });

    it('should handle different product types', () => {
      const electronicsProduct: Product = {
        id: 2,
        title: 'Smartphone',
        price: 599.99,
        description: 'Latest smartphone',
        category: 'Electronics',
        image: 'https://example.com/phone.jpg'
      };

      const clothingProduct: Product = {
        id: 3,
        title: 'T-Shirt',
        price: 29.99,
        description: 'Cotton t-shirt',
        category: 'Clothing',
        image: 'https://example.com/tshirt.jpg'
      };

      expect(electronicsProduct.category).toBe('Electronics');
      expect(clothingProduct.category).toBe('Clothing');
    });
  });

  describe('ProductEventType enum', () => {
    it('should have correct enum values', () => {
      expect(ProductEventType.PRODUCT_FAVORITED).toBe('PRODUCT_FAVORITED');
      expect(ProductEventType.PRODUCT_UNFAVORITED).toBe('PRODUCT_UNFAVORITED');
    });

    it('should be usable in conditional statements', () => {
      const eventType = ProductEventType.PRODUCT_FAVORITED;
      
      let result = '';
      if (eventType === ProductEventType.PRODUCT_FAVORITED) {
        result = 'favorited';
      } else {
        result = 'other';
      }
      expect(result).toBe('favorited');
      
      const unfavoritedType = ProductEventType.PRODUCT_UNFAVORITED;
      let result2 = '';
      if (unfavoritedType === ProductEventType.PRODUCT_UNFAVORITED) {
        result2 = 'unfavorited';
      } else {
        result2 = 'other';
      }
      expect(result2).toBe('unfavorited');
    });
  });

  describe('ProductEvent interface', () => {
    it('should create a valid ProductEvent for favorited action', () => {
      const event: ProductEvent = {
        type: ProductEventType.PRODUCT_FAVORITED,
        payload: {
          userId: 'user123',
          productId: 1,
          timestamp: new Date('2023-01-01T00:00:00Z')
        }
      };

      expect(event.type).toBe(ProductEventType.PRODUCT_FAVORITED);
      expect(event.payload.userId).toBe('user123');
      expect(event.payload.productId).toBe(1);
      expect(event.payload.timestamp).toEqual(new Date('2023-01-01T00:00:00Z'));
    });

    it('should create a valid ProductEvent for unfavorited action', () => {
      const event: ProductEvent = {
        type: ProductEventType.PRODUCT_UNFAVORITED,
        payload: {
          userId: 'user456',
          productId: 2,
          timestamp: new Date('2023-01-02T00:00:00Z')
        }
      };

      expect(event.type).toBe(ProductEventType.PRODUCT_UNFAVORITED);
      expect(event.payload.userId).toBe('user456');
      expect(event.payload.productId).toBe(2);
      expect(event.payload.timestamp).toEqual(new Date('2023-01-02T00:00:00Z'));
    });

    it('should handle different event types correctly', () => {
      const favoritedEvent: ProductEvent = {
        type: ProductEventType.PRODUCT_FAVORITED,
        payload: {
          userId: 'user1',
          productId: 1,
          timestamp: new Date()
        }
      };

      const unfavoritedEvent: ProductEvent = {
        type: ProductEventType.PRODUCT_UNFAVORITED,
        payload: {
          userId: 'user1',
          productId: 1,
          timestamp: new Date()
        }
      };

      expect(favoritedEvent.type).not.toBe(unfavoritedEvent.type);
      expect(favoritedEvent.payload.userId).toBe(unfavoritedEvent.payload.userId);
      expect(favoritedEvent.payload.productId).toBe(unfavoritedEvent.payload.productId);
    });
  });
});
