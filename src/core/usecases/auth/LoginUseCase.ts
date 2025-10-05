import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { AppError, ErrorCode } from '../../errors/AppError';

export interface AuthCredentials {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<User> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new AppError(
          'Email e senha são obrigatórios',
          ErrorCode.VALIDATION_ERROR
        );
      }

      const user = await this.authRepository.login(credentials);
      
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Falha ao realizar login',
        ErrorCode.AUTHENTICATION_ERROR,
        error
      );
    }
  }
}