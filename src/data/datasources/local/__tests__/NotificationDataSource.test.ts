import { NotificationDataSource } from '../NotificationDataSource';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Mock Expo modules
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

describe('NotificationDataSource', () => {
  let notificationDataSource: NotificationDataSource;
  let mockSubscription: any;

  beforeEach(() => {
    notificationDataSource = new NotificationDataSource();
    mockSubscription = {
      remove: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('requestPermission', () => {
    it('should return true when permission already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await notificationDataSource.requestPermission();

      expect(result).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should request permission and return true when granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await notificationDataSource.requestPermission();

      expect(result).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('should return false when permission denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await notificationDataSource.requestPermission();

      expect(result).toBe(false);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('should return false when permission request fails', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
        new Error('Permission error')
      );

      const result = await notificationDataSource.requestPermission();

      expect(result).toBe(false);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getToken', () => {
    it('should get token successfully', async () => {
      const mockToken = 'ExponentPushToken[test-token]';
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
        data: mockToken,
      });

      const result = await notificationDataSource.getToken();

      expect(result).toBe(mockToken);
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({
        projectId: 'test-project-id',
      });
    });

    it('should return null when token request fails', async () => {
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockRejectedValue(
        new Error('Token error')
      );

      const result = await notificationDataSource.getToken();

      expect(result).toBeNull();
      expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({
        projectId: 'test-project-id',
      });
    });

    it('should handle empty token response', async () => {
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
        data: '',
      });

      const result = await notificationDataSource.getToken();

      expect(result).toBe('');
    });
  });

  describe('onNotificationReceived', () => {
    it('should set up notification received listener', () => {
      const callback = jest.fn();
      (Notifications.addNotificationReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const unsubscribe = notificationDataSource.onNotificationReceived(callback);

      expect(Notifications.addNotificationReceivedListener).toHaveBeenCalledWith(callback);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should call remove when unsubscribe is called', () => {
      const callback = jest.fn();
      (Notifications.addNotificationReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const unsubscribe = notificationDataSource.onNotificationReceived(callback);
      unsubscribe();

      expect(mockSubscription.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('onNotificationResponse', () => {
    it('should set up notification response listener', () => {
      const callback = jest.fn();
      (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const unsubscribe = notificationDataSource.onNotificationResponse(callback);

      expect(Notifications.addNotificationResponseReceivedListener).toHaveBeenCalledWith(callback);
      expect(typeof unsubscribe).toBe('function');
    });

    it('should call remove when unsubscribe is called', () => {
      const callback = jest.fn();
      (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const unsubscribe = notificationDataSource.onNotificationResponse(callback);
      unsubscribe();

      expect(mockSubscription.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification successfully', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      const data = { key: 'value' };
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(undefined);

      await notificationDataSource.scheduleNotification(title, body, data);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title,
          body,
          data,
        },
        trigger: null,
      });
    });

    it('should schedule notification without data', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(undefined);

      await notificationDataSource.scheduleNotification(title, body);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title,
          body,
          data: undefined,
        },
        trigger: null,
      });
    });

    it('should handle notification scheduling error', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      const error = new Error('Scheduling failed');
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(error);

      await expect(notificationDataSource.scheduleNotification(title, body)).rejects.toThrow(error);
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete notification workflow', async () => {
      // Request permission
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'undetermined',
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const permissionResult = await notificationDataSource.requestPermission();
      expect(permissionResult).toBe(true);

      // Get token
      const mockToken = 'ExponentPushToken[integration-token]';
      (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
        data: mockToken,
      });

      const tokenResult = await notificationDataSource.getToken();
      expect(tokenResult).toBe(mockToken);

      // Set up listeners
      (Notifications.addNotificationReceivedListener as jest.Mock).mockReturnValue(mockSubscription);
      (Notifications.addNotificationResponseReceivedListener as jest.Mock).mockReturnValue(mockSubscription);

      const receivedCallback = jest.fn();
      const responseCallback = jest.fn();

      const unsubscribeReceived = notificationDataSource.onNotificationReceived(receivedCallback);
      const unsubscribeResponse = notificationDataSource.onNotificationResponse(responseCallback);

      expect(typeof unsubscribeReceived).toBe('function');
      expect(typeof unsubscribeResponse).toBe('function');

      // Schedule notification
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(undefined);
      await notificationDataSource.scheduleNotification('Integration Test', 'Test notification');

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Integration Test',
          body: 'Test notification',
          data: undefined,
        },
        trigger: null,
      });

      // Cleanup
      unsubscribeReceived();
      unsubscribeResponse();
      expect(mockSubscription.remove).toHaveBeenCalledTimes(2);
    });
  });
});