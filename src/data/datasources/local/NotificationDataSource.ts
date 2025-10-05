import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export class NotificationDataSource {
    async requestPermission(): Promise<boolean> {
        try {
            if (!Device.isDevice) {
                console.log('[Notifications] Emulador detectado');
                return false;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('[Notifications] Permission denied');
                return false;
            }

            console.log('[Notifications] Permission granted');
            return true;
        } catch (error) {
            console.error('[Notifications] Permission error:', error);
            return false;
        }
    }

    async getToken(): Promise<string | null> {
        try {
            if (!Device.isDevice) {
                return null;
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            console.log('[Notifications] Token:', token.data);
            return token.data;
        } catch (error) {
            console.error('[Notifications] Get token error:', error);
            return null;
        }
    }

    onNotificationReceived(callback: (notification: any) => void): () => void {
        const subscription = Notifications.addNotificationReceivedListener(callback);
        return () => subscription.remove();
    }

    onNotificationResponse(callback: (response: any) => void): () => void {
        const subscription = Notifications.addNotificationResponseReceivedListener(callback);
        return () => subscription.remove();
    }

    async scheduleNotification(title: string, body: string, data?: any): Promise<void> {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
            },
            trigger: null,
        });
    }
}