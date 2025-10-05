export enum ErrorCode {
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    REGISTRATION_ERROR = 'REGISTRATION_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',

    VALIDATION_ERROR = 'VALIDATION_ERROR',

    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',

    STORAGE_ERROR = 'STORAGE_ERROR',

    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    NOT_FOUND = 'NOT_FOUND',
}

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly timestamp: Date;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
        originalError?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.timestamp = new Date();
        this.originalError = originalError;

        Object.setPrototypeOf(this, AppError.prototype);
    }

    getUserMessage(): string {
        switch (this.code) {
            case ErrorCode.AUTHENTICATION_ERROR:
                return 'Email ou senha incorretos. Tente novamente.';
            case ErrorCode.NETWORK_ERROR:
                return 'Erro de conexão. Verifique sua internet.';
            case ErrorCode.VALIDATION_ERROR:
                return this.message;
            case ErrorCode.UNAUTHORIZED:
                return 'Sessão expirada. Faça login novamente.';
            default:
                return 'Ocorreu um erro. Tente novamente.';
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            timestamp: this.timestamp,
        };
    }
}

export class ErrorFactory {
    static authenticationFailed(originalError?: unknown): AppError {
        return new AppError(
            'Falha na autenticação',
            ErrorCode.AUTHENTICATION_ERROR,
            originalError
        );
    }

    static networkError(originalError?: unknown): AppError {
        return new AppError(
            'Erro de conexão',
            ErrorCode.NETWORK_ERROR,
            originalError
        );
    }

    static validationError(message: string): AppError {
        return new AppError(message, ErrorCode.VALIDATION_ERROR);
    }

    static unauthorized(): AppError {
        return new AppError('Não autorizado', ErrorCode.UNAUTHORIZED);
    }

    static handleFirebaseAuthError(error: any): AppError {
        const errorCode = error.code;

        switch (errorCode) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return this.authenticationFailed(error);
            case 'auth/email-already-in-use':
                return new AppError('Este email já está em uso', ErrorCode.REGISTRATION_ERROR, error);
            case 'auth/weak-password':
                return this.validationError('Senha muito fraca');
            case 'auth/invalid-email':
                return this.validationError('Email inválido');
            case 'auth/network-request-failed':
                return this.networkError(error);
            case 'auth/too-many-requests':
                return new AppError('Muitas tentativas. Tente novamente mais tarde', ErrorCode.AUTHENTICATION_ERROR, error);
            case 'auth/user-disabled':
                return new AppError('Conta desabilitada', ErrorCode.UNAUTHORIZED, error);
            default:
                return this.authenticationFailed(error);
        }
    }

    static handleFirestoreError(error: any): AppError {
        const errorCode = error.code;

        switch (errorCode) {
            case 'permission-denied':
                return this.unauthorized();
            case 'unavailable':
                return this.networkError(error);
            case 'deadline-exceeded':
                return new AppError('Tempo limite excedido', ErrorCode.TIMEOUT_ERROR, error);
            case 'not-found':
                return new AppError('Recurso não encontrado', ErrorCode.NOT_FOUND, error);
            case 'already-exists':
                return this.validationError('Recurso já existe');
            case 'failed-precondition':
                return this.validationError('Condição prévia não atendida');
            case 'out-of-range':
                return this.validationError('Valor fora do intervalo permitido');
            case 'unimplemented':
                return new AppError('Operação não implementada', ErrorCode.UNKNOWN_ERROR, error);
            case 'internal':
                return new AppError('Erro interno do servidor', ErrorCode.UNKNOWN_ERROR, error);
            default:
                return new AppError('Erro no banco de dados', ErrorCode.STORAGE_ERROR, error);
        }
    }

    static handleGenericError(error: any, context: string): AppError {
        if (error instanceof AppError) {
            return error;
        }

        if (error?.code) {
            if (error.code.startsWith('auth/')) {
                return this.handleFirebaseAuthError(error);
            }
            
            if (error.code.startsWith('firestore/')) {
                return this.handleFirestoreError(error);
            }
        }

        return new AppError(
            `Erro em ${context}: ${error?.message || 'Erro desconhecido'}`,
            ErrorCode.UNKNOWN_ERROR,
            error
        );
    }
} 