import { useEffect, useState } from 'react';
import { NotificationDataSource } from '../../data/datasources/local/NotificationDataSource';
import { Logger } from '../../utils/helpers/logger';

const notificationDataSource = new NotificationDataSource();

export const useNotifications = () => {
    const [token, setToken] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        initializeNotifications();
    }, []);

    const initializeNotifications = async () => {
        try {
            const permission = await notificationDataSource.requestPermission();
            setHasPermission(permission);

            if (!permission) {
                Logger.warn('Notification permission denied');
                return;
            }

            const expoToken = await notificationDataSource.getToken();
            if (expoToken) {
                setToken(expoToken);
                Logger.info('Expo Token:', expoToken);
            }

            const unsubscribeReceived = notificationDataSource.onNotificationReceived((notification) => {
                Logger.info('Notification received:', notification);
            });

            const unsubscribeResponse = notificationDataSource.onNotificationResponse((response) => {
                Logger.info('Notification response:', response);
            });

            return () => {
                unsubscribeReceived();
                unsubscribeResponse();
            };
        } catch (error) {
            Logger.error('Failed to initialize notifications', error);
        }
    };

    const sendNotification = async (title: string, body: string, data?: any) => {
        try {
            await notificationDataSource.scheduleNotification(title, body, data);
            Logger.info('Notification sent successfully');
        } catch (error) {
            Logger.error('Failed to send notification', error);
        }
    };

    return {
        token,
        hasPermission,
        sendNotification,
    };
};