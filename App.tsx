import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/presentation/contexts/AuthContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { NotificationDataSource } from './src/data/datasources/local/NotificationDataSource';
import { Logger } from './src/utils/helpers/logger';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native core',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      Logger.info('Initializing Expo app...');

      const notificationDataSource = new NotificationDataSource();

      const hasPermission = await notificationDataSource.requestPermission();
      if (hasPermission) {
        const token = await notificationDataSource.getToken();
        Logger.info('Expo Push Token:', token);
      }

      notificationDataSource.onNotificationReceived((notification) => {
        Logger.info('Notification received:', notification);
      });

      notificationDataSource.onNotificationResponse((response) => {
        Logger.info('Notification response:', response);
      });

      Logger.info('App initialized successfully');
    } catch (error) {
      Logger.error('App initialization failed', error);
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
