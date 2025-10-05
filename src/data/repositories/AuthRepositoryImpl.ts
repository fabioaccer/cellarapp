import { IAuthRepository } from '../../core/domain/repositories/IAuthRepository';
import { User, AuthCredentials, RegisterData } from '../../core/domain/entities/User';
import { FirebaseAuthDataSource } from '../datasources/local/FirebaseAuthDataSource';
import { AppError, ErrorCode } from '../../core/errors/AppError';

export class AuthRepositoryImpl implements IAuthRepository {
    constructor(private firebaseAuth: FirebaseAuthDataSource) { }

    async login(credentials: AuthCredentials): Promise<User> {
        try {
            return await this.firebaseAuth.login(credentials);
        } catch (error) {
            throw new AppError(
                'Falha no login',
                ErrorCode.AUTHENTICATION_ERROR,
                error
            );
        }
    }

    async register(data: RegisterData): Promise<User> {
        try {
            return await this.firebaseAuth.register(data);
        } catch (error) {
            throw new AppError(
                'Falha ao criar conta',
                ErrorCode.REGISTRATION_ERROR,
                error
            );
        }
    }

    async logout(): Promise<void> {
        try {
            await this.firebaseAuth.logout();
        } catch (error) {
            throw new AppError(
                'Erro ao fazer logout',
                ErrorCode.UNKNOWN_ERROR,
                error
            );
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            return await this.firebaseAuth.getCurrentUser();
        } catch (error) {
            return null;
        }
    }

    async resetPassword(email: string): Promise<void> {
        try {
            await this.firebaseAuth.resetPassword(email);
        } catch (error) {
            throw new AppError(
                'Erro ao redefinir senha',
                ErrorCode.AUTHENTICATION_ERROR,
                error
            );
        }
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<void> {
        try {
            await this.firebaseAuth.updateProfile(userId, data);
        } catch (error) {
            throw new AppError(
                'Erro ao atualizar perfil',
                ErrorCode.STORAGE_ERROR,
                error
            );
        }
    }
}