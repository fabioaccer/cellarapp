import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/config';
import { User } from '../../core/domain/entities/User';
import { LoginUseCase } from '../../core/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '../../core/usecases/auth/RegisterUseCase';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { FirebaseAuthDataSource, AuthCredentials, RegisterData } from '../../data/datasources/local/FirebaseAuthDataSource';
import { Logger } from '../../utils/helpers/logger';

const firebaseAuthDataSource = new FirebaseAuthDataSource();
const authRepository = new AuthRepositoryImpl(firebaseAuthDataSource);
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const mappedUser: User = {
                        id: firebaseUser.uid,
                        email: firebaseUser.email!,
                        displayName: firebaseUser.displayName || undefined,
                        photoURL: firebaseUser.photoURL || undefined,
                        createdAt: firebaseUser.metadata.creationTime
                            ? new Date(firebaseUser.metadata.creationTime)
                            : new Date(),
                    };
                    setUser(mappedUser);
                    Logger.info('User authenticated:', mappedUser.email);
                } else {
                    setUser(null);
                    Logger.info('User logged out');
                }
            } catch (error) {
                Logger.error('Auth state change error', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const login = useCallback(async (credentials: AuthCredentials) => {
        try {
            setIsLoading(true);
            const loggedUser = await loginUseCase.execute(credentials);
            setUser(loggedUser);
            Logger.info('Login successful');
        } catch (error) {
            Logger.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        try {
            setIsLoading(true);
            const newUser = await registerUseCase.execute(data);
            setUser(newUser);
            Logger.info('Registration successful');
        } catch (error) {
            Logger.error('Registration failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await authRepository.logout();
            setUser(null);
            Logger.info('Logout successful');
        } catch (error) {
            Logger.error('Logout failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        try {
            await authRepository.resetPassword(email);
            Logger.info('Password reset email sent');
        } catch (error) {
            Logger.error('Reset password failed', error);
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};