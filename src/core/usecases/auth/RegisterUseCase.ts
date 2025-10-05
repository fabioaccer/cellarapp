import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { AppError, ErrorCode } from '../../errors/AppError';

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<User> {
    try {
      this.validate(data);

      const user = await this.authRepository.register(data);
      
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Falha ao criar conta',
        ErrorCode.REGISTRATION_ERROR,
        error
      );
    }
  }

  private validate(data: RegisterData): void {
    if (!data.email || !data.password) {
      throw new AppError(
        'Email e senha são obrigatórios',
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (data.password.length < 6) {
      throw new AppError(
        'A senha deve ter no mínimo 6 caracteres',
        ErrorCode.VALIDATION_ERROR
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError(
        'Email inválido',
        ErrorCode.VALIDATION_ERROR
      );
    }
  }
}