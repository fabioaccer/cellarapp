import { User, AuthCredentials, RegisterData } from '../entities/User';

export interface IAuthRepository {
  login(credentials: AuthCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
  updateProfile(userId: string, data: Partial<User>): Promise<void>;
}