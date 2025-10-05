import { RegisterUseCase } from '../RegisterUseCase';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';
import { AppError, ErrorCode } from '../../../errors/AppError';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
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

    registerUseCase = new RegisterUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date(),
    };

    it('deve registrar usuário com dados válidos', async () => {
      mockAuthRepository.register.mockResolvedValue(mockUser);

      const result = await registerUseCase.execute(validRegisterData);

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.register).toHaveBeenCalledWith(validRegisterData);
    });

    it('deve registrar usuário sem displayName', async () => {
      const dataWithoutDisplayName = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthRepository.register.mockResolvedValue(mockUser);

      const result = await registerUseCase.execute(dataWithoutDisplayName);

      expect(result).toEqual(mockUser);
      expect(mockAuthRepository.register).toHaveBeenCalledWith(dataWithoutDisplayName);
    });

    it('deve lançar erro de validação quando email estiver vazio', async () => {
      const invalidData = {
        email: '',
        password: 'password123',
      };

      await expect(registerUseCase.execute(invalidData)).rejects.toThrow(AppError);
      await expect(registerUseCase.execute(invalidData)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Email e senha são obrigatórios',
      });
    });

    it('deve lançar erro de validação quando senha estiver vazia', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      await expect(registerUseCase.execute(invalidData)).rejects.toThrow(AppError);
      await expect(registerUseCase.execute(invalidData)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Email e senha são obrigatórios',
      });
    });

    it('deve lançar erro de validação quando senha for menor que 6 caracteres', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };

      await expect(registerUseCase.execute(invalidData)).rejects.toThrow(AppError);
      await expect(registerUseCase.execute(invalidData)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'A senha deve ter no mínimo 6 caracteres',
      });
    });

    it('deve aceitar senha com exatamente 6 caracteres', async () => {
      const validData = {
        email: 'test@example.com',
        password: '123456',
      };

      mockAuthRepository.register.mockResolvedValue(mockUser);

      const result = await registerUseCase.execute(validData);

      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro de validação para email inválido', async () => {
      const invalidData = {
        email: 'email-invalido',
        password: 'password123',
      };

      await expect(registerUseCase.execute(invalidData)).rejects.toThrow(AppError);
      await expect(registerUseCase.execute(invalidData)).rejects.toMatchObject({
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Email inválido',
      });
    });

    it('deve aceitar emails válidos com diferentes formatos', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@456.com',
      ];

      for (const email of validEmails) {
        const data = {
          email,
          password: 'password123',
        };

        mockAuthRepository.register.mockResolvedValue(mockUser);

        const result = await registerUseCase.execute(data);
        expect(result).toEqual(mockUser);
      }
    });

    it('deve rejeitar emails inválidos', async () => {
      const invalidEmails = [
        'email',
        '@domain.com',
        'user@',
        'user@domain',
      ];

      for (const email of invalidEmails) {
        const data = {
          email,
          password: 'password123',
        };

        await expect(registerUseCase.execute(data)).rejects.toThrow(AppError);
      }
    });

    it('deve lançar AppError quando repositório lançar AppError', async () => {
      const appError = new AppError('Email já em uso', ErrorCode.REGISTRATION_ERROR);
      mockAuthRepository.register.mockRejectedValue(appError);

      await expect(registerUseCase.execute(validRegisterData)).rejects.toThrow(appError);
    });

    it('deve lançar AppError genérico quando repositório lançar erro não tratado', async () => {
      const genericError = new Error('Erro de rede');
      mockAuthRepository.register.mockRejectedValue(genericError);

      await expect(registerUseCase.execute(validRegisterData)).rejects.toThrow(AppError);
      await expect(registerUseCase.execute(validRegisterData)).rejects.toMatchObject({
        code: ErrorCode.REGISTRATION_ERROR,
        message: 'Falha ao criar conta',
      });
    });

    it('deve preservar o erro original quando repositório lançar erro não tratado', async () => {
      const genericError = new Error('Erro de rede');
      mockAuthRepository.register.mockRejectedValue(genericError);

      try {
        await registerUseCase.execute(validRegisterData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(genericError);
      }
    });
  });
});
