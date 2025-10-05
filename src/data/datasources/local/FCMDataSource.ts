import { getToken, onMessage } from 'firebase/messaging';
import { initializeMessaging } from '../../../infrastructure/firebase/config';

export class FCMDataSource {
    private messaging: any = null;

    async initialize(): Promise<boolean> {
        try {
            this.messaging = await initializeMessaging();
            return this.messaging !== null;
        } catch (error) {
            console.error('[FCM] Initialization failed:', error);
            return false;
        }
    }

    async requestPermission(): Promise<boolean> {
        console.log('[FCM] Permission request - requires native setup');
        return false;
    }

    async getToken(): Promise<string | null> {
        if (!this.messaging) {
            console.log('[FCM] Messaging not initialized');
            return null;
        }

        try {
            const token = await getToken(this.messaging, {
                vapidKey: process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY
            });
            console.log('[FCM] Token:', token);
            return token;
        } catch (error) {
            console.error('[FCM] Get token error:', error);
            return null;
        }
    }

    onMessageReceived(callback: (payload: any) => void): () => void {
        if (!this.messaging) {
            console.log('[FCM] Messaging not initialized');
            return () => {};
        }

        const unsubscribe = onMessage(this.messaging, callback);
        return unsubscribe;
    }

    /*
    async sendNotification(title: string, body: string, data?: any): Promise<void> {
        // Implementation would require server-side setup
        console.log('[FCM] Send notification:', { title, body, data });
    }
    */
}
