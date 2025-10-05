import { useEffect, useState } from 'react';

// Mock NotificationDataSource
jest.mock('../../../data/datasources/local/NotificationDataSource', () => ({
  NotificationDataSource: jest.fn().mockImplementation(() => ({
    requestPermission: jest.fn(),
    getToken: jest.fn(),
    onNotificationReceived: jest.fn(),
    onNotificationResponse: jest.fn(),
    scheduleNotification: jest.fn(),
  })),
}));

// Mock Logger
jest.mock('../../../utils/helpers/logger', () => ({
  Logger: {
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const mockUseEffect = useEffect as jest.MockedFunction<typeof useEffect>;
const mockUseState = useState as jest.MockedFunction<typeof useState>;

// Import useNotifications after mocks
const { useNotifications } = require('../useNotifications');

describe('useNotifications', () => {
  let mockNotificationDataSource: any;

  beforeEach(() => {
    mockNotificationDataSource = {
      requestPermission: jest.fn(),
      getToken: jest.fn(),
      onNotificationReceived: jest.fn(),
      onNotificationResponse: jest.fn(),
      scheduleNotification: jest.fn(),
    };
    
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const mockSetToken = jest.fn();
      const mockSetHasPermission = jest.fn();
      
      mockUseState
        .mockReturnValueOnce([null, mockSetToken])
        .mockReturnValueOnce([false, mockSetHasPermission]);

      const result = useNotifications();

      expect(result.token).toBe(null);
      expect(result.hasPermission).toBe(false);
      expect(mockUseState).toHaveBeenCalledWith(null);
      expect(mockUseState).toHaveBeenCalledWith(false);
    });

    it('should call useEffect on mount', () => {
      const mockSetToken = jest.fn();
      const mockSetHasPermission = jest.fn();
      
      mockUseState
        .mockReturnValueOnce([null, mockSetToken])
        .mockReturnValueOnce([false, mockSetHasPermission]);

      useNotifications();

      expect(mockUseEffect).toHaveBeenCalledTimes(1);
      expect(mockUseEffect).toHaveBeenCalledWith(expect.any(Function), []);
    });
  });

  describe('return values', () => {
    it('should return correct values when initialized', () => {
      const mockToken = 'ExponentPushToken[test-token]';
      const mockSetToken = jest.fn();
      const mockSetHasPermission = jest.fn();
      
      mockUseState
        .mockReturnValueOnce([mockToken, mockSetToken])
        .mockReturnValueOnce([true, mockSetHasPermission]);

      const result = useNotifications();

      expect(result.token).toBe(mockToken);
      expect(result.hasPermission).toBe(true);
      expect(typeof result.sendNotification).toBe('function');
    });

    it('should return correct values when not initialized', () => {
      const mockSetToken = jest.fn();
      const mockSetHasPermission = jest.fn();
      
      mockUseState
        .mockReturnValueOnce([null, mockSetToken])
        .mockReturnValueOnce([false, mockSetHasPermission]);

      const result = useNotifications();

      expect(result.token).toBe(null);
      expect(result.hasPermission).toBe(false);
      expect(typeof result.sendNotification).toBe('function');
    });
  });

  describe('sendNotification', () => {
    it('should have sendNotification function', () => {
      const mockSetToken = jest.fn();
      const mockSetHasPermission = jest.fn();
      
      mockUseState
        .mockReturnValueOnce([null, mockSetToken])
        .mockReturnValueOnce([true, mockSetHasPermission]);

      const result = useNotifications();

      expect(typeof result.sendNotification).toBe('function');
    });
  });
});