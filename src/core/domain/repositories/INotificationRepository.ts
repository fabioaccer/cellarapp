export interface INotificationRepository {
  requestPermission(): Promise<boolean>;
  getToken(): Promise<string | null>;
  onTokenRefresh(callback: (token: string) => void): () => void;
  onMessage(callback: (message: any) => void): () => void;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
}