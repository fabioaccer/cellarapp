import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../../../infrastructure/firebase/config';
import { User } from '../../../core/domain/entities/User';
import { AppError, ErrorCode, ErrorFactory } from '../../../core/errors/AppError';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends AuthCredentials {
    displayName?: string;
}

export class FirebaseAuthDataSource {
    async login(credentials: AuthCredentials): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );
            return this.mapFirebaseUser(userCredential.user);
        } catch (error: any) {
            throw ErrorFactory.handleFirebaseAuthError(error);
        }
    }

    async register(data: RegisterData): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            if (data.displayName && userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: data.displayName,
                });
            }

            return this.mapFirebaseUser(userCredential.user);
        } catch (error: any) {
            throw ErrorFactory.handleFirebaseAuthError(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            throw ErrorFactory.handleGenericError(error, 'logout');
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;
        return this.mapFirebaseUser(firebaseUser);
    }

    async resetPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            throw ErrorFactory.handleFirebaseAuthError(error);
        }
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<void> {
        try {
            const user = auth.currentUser;
            if (!user || user.uid !== userId) {
                throw new AppError('Usuário não encontrado', ErrorCode.UNAUTHORIZED);
            }

            await updateProfile(user, {
                displayName: data.displayName,
                photoURL: data.photoURL,
            });
        } catch (error: any) {
            throw ErrorFactory.handleGenericError(error, 'atualização de perfil');
        }
    }

    private mapFirebaseUser(firebaseUser: FirebaseUser): User {
        return {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: firebaseUser.metadata.creationTime
                ? new Date(firebaseUser.metadata.creationTime)
                : new Date(),
        };
    }

}