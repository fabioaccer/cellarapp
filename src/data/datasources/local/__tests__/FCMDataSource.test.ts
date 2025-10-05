import { FCMDataSource } from '../FCMDataSource';
import { getToken, onMessage } from 'firebase/messaging';
import { initializeMessaging } from '../../../../infrastructure/firebase/config';

// Mock Firebase messaging
jest.mock('firebase/messaging', () => ({
  getToken: jest.fn(),
  onMessage: jest.fn(),
}));

// Mock Firebase config
jest.mock('../../../../infrastructure/firebase/config', () => ({
  initializeMessaging: jest.fn(),
}));

describe('FCMDataSource', () => {
  let fcmDataSource: FCMDataSource;
  let mockMessaging: any;

  beforeEach(() => {
    fcmDataSource = new FCMDataSource();
    mockMessaging = {
      // Mock messaging object
    };
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize successfully when messaging is available', async () => {
      (initializeMessaging as jest.Mock).mockResolvedValue(mockMessaging);

      const result = await fcmDataSource.initialize();

      expect(result).toBe(true);
      expect(initializeMessaging).toHaveBeenCalledTimes(1);
    });

    it('should return false when messaging initialization fails', async () => {
      (initializeMessaging as jest.Mock).mockResolvedValue(null);

      const result = await fcmDataSource.initialize();

      expect(result).toBe(false);
      expect(initializeMessaging).toHaveBeenCalledTimes(1);
    });

    it('should return false when messaging initialization throws error', async () => {
      (initializeMessaging as jest.Mock).mockRejectedValue(new Error('Initialization failed'));

      const result = await fcmDataSource.initialize();

      expect(result).toBe(false);
      expect(initializeMessaging).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestPermission', () => {
    it('should return false (requires native setup)', async () => {
      const result = await fcmDataSource.requestPermission();

      expect(result).toBe(false);
    });
  });

  describe('getToken', () => {
    beforeEach(async () => {
      (initializeMessaging as jest.Mock).mockResolvedValue(mockMessaging);
      await fcmDataSource.initialize();
    });

    it('should return null when messaging is not initialized', async () => {
      const uninitializedDataSource = new FCMDataSource();
      
      const result = await uninitializedDataSource.getToken();

      expect(result).toBeNull();
    });

    it('should get token successfully', async () => {
      const mockToken = 'mock-fcm-token';
      (getToken as jest.Mock).mockResolvedValue(mockToken);

      const result = await fcmDataSource.getToken();

      expect(result).toBe(mockToken);
      expect(getToken).toHaveBeenCalledWith(mockMessaging, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY
      });
    });

    it('should return null when getToken fails', async () => {
      (getToken as jest.Mock).mockRejectedValue(new Error('Token error'));

      const result = await fcmDataSource.getToken();

      expect(result).toBeNull();
      expect(getToken).toHaveBeenCalledWith(mockMessaging, {
        vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY
      });
    });

    it('should handle empty token response', async () => {
      (getToken as jest.Mock).mockResolvedValue('');

      const result = await fcmDataSource.getToken();

      expect(result).toBe('');
    });
  });

  describe('onMessageReceived', () => {
    beforeEach(async () => {
      (initializeMessaging as jest.Mock).mockResolvedValue(mockMessaging);
      await fcmDataSource.initialize();
    });

    it('should return empty function when messaging is not initialized', () => {
      const uninitializedDataSource = new FCMDataSource();
      const callback = jest.fn();
      
      const unsubscribe = uninitializedDataSource.onMessageReceived(callback);

      expect(typeof unsubscribe).toBe('function');
      expect(onMessage).not.toHaveBeenCalled();
    });

    it('should set up message listener and return unsubscribe function', () => {
      const mockUnsubscribe = jest.fn();
      const callback = jest.fn();
      (onMessage as jest.Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = fcmDataSource.onMessageReceived(callback);

      expect(onMessage).toHaveBeenCalledWith(mockMessaging, callback);
      expect(typeof unsubscribe).toBe('function');
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call unsubscribe when returned function is called', () => {
      const mockUnsubscribe = jest.fn();
      const callback = jest.fn();
      (onMessage as jest.Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = fcmDataSource.onMessageReceived(callback);
      unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple message listeners', () => {
      const mockUnsubscribe1 = jest.fn();
      const mockUnsubscribe2 = jest.fn();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      (onMessage as jest.Mock)
        .mockReturnValueOnce(mockUnsubscribe1)
        .mockReturnValueOnce(mockUnsubscribe2);

      const unsubscribe1 = fcmDataSource.onMessageReceived(callback1);
      const unsubscribe2 = fcmDataSource.onMessageReceived(callback2);

      expect(onMessage).toHaveBeenCalledTimes(2);
      expect(onMessage).toHaveBeenNthCalledWith(1, mockMessaging, callback1);
      expect(onMessage).toHaveBeenNthCalledWith(2, mockMessaging, callback2);
      expect(unsubscribe1).toBe(mockUnsubscribe1);
      expect(unsubscribe2).toBe(mockUnsubscribe2);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete FCM flow', async () => {
      // Initialize
      (initializeMessaging as jest.Mock).mockResolvedValue(mockMessaging);
      const initResult = await fcmDataSource.initialize();
      expect(initResult).toBe(true);

      // Get token
      const mockToken = 'integration-token';
      (getToken as jest.Mock).mockResolvedValue(mockToken);
      const tokenResult = await fcmDataSource.getToken();
      expect(tokenResult).toBe(mockToken);

      // Set up message listener
      const mockUnsubscribe = jest.fn();
      const callback = jest.fn();
      (onMessage as jest.Mock).mockReturnValue(mockUnsubscribe);
      const unsubscribe = fcmDataSource.onMessageReceived(callback);
      expect(typeof unsubscribe).toBe('function');

      // Cleanup
      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should handle error scenarios gracefully', async () => {
      // Failed initialization
      (initializeMessaging as jest.Mock).mockRejectedValue(new Error('Network error'));
      const initResult = await fcmDataSource.initialize();
      expect(initResult).toBe(false);

      // Token request should return null when messaging is not initialized
      const tokenResult = await fcmDataSource.getToken();
      expect(tokenResult).toBeNull();
    });
  });
});
