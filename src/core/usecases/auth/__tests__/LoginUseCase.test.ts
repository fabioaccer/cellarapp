import { LoginUseCase } from '../LoginUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';
import { AppError, ErrorCode } from '../../../errors/AppError';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockAuthRepository = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      resetPassword: jest.fn(),
      updateProfile: jest.fn(),
    } as jest.Mocked<IAuthRepository>;

    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date(),
    };

    it('deve fazer login com credenciais válidas', async () => {
      mockAuthRepository.login.mockResolvedValue(mockUser);

      const result = await loginUseCase.execute(validCredentials);

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.login).toHaveBeenCalledWith(validCredentials);
    });

    it('deve lançar erro de validação quando email estiver vazio', async () => {
      const invalidCredentials = {
        email: '',
        password: 'password123',
      };

      await expect(loginUseCase.execute(invalidCredentials)).rejects.toThrow(AppError);
      await expect(loginUseCase.execute(invalidCredentials)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Email e senha são obrigatórios',
      });
    });

    it('deve lançar erro de validação quando senha estiver vazia', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: '',
      };

      await expect(loginUseCase.execute(invalidCredentials)).rejects.toThrow(AppError);
      await expect(loginUseCase.execute(invalidCredentials)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Email e senha são obrigatórios',
      });
    });

    it('deve lançar erro de validação quando email for undefined', async () => {
      const invalidCredentials = {
        email: undefined as any,
        password: 'password123',
      };

      await expect(loginUseCase.execute(invalidCredentials)).rejects.toThrow(AppError);
    });

    it('deve lançar erro de validação quando senha for undefined', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: undefined as any,
      };

      await expect(loginUseCase.execute(invalidCredentials)).rejects.toThrow(AppError);
    });

    it('deve lançar AppError quando repositório lançar AppError', async () => {
      const appError = new AppError('Credenciais inválidas', ErrorCode.AUTHENTICATION_ERROR);
      mockAuthRepository.login.mockRejectedValue(appError);

      await expect(loginUseCase.execute(validCredentials)).rejects.toThrow(appError);
    });

    it('deve lançar AppError genérico quando repositório lançar erro não tratado', async () => {
      const genericError = new Error('Erro de rede');
      mockAuthRepository.login.mockRejectedValue(genericError);

      await expect(loginUseCase.execute(validCredentials)).rejects.toThrow(AppError);
      await expect(loginUseCase.execute(validCredentials)).rejects.toMatchObject({
        code: ErrorCode.AUTHENTICATION_ERROR,
        message: 'Falha ao realizar login',
      });
    });

    it('deve preservar o erro original quando repositório lançar erro não tratado', async () => {
      const genericError = new Error('Erro de rede');
      mockAuthRepository.login.mockRejectedValue(genericError);

      try {
        await loginUseCase.execute(validCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(genericError);
      }
    });
  });
});
