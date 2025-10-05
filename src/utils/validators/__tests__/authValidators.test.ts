import { loginSchema, registerSchema, forgotPasswordSchema } from '../authValidators';

describe('authValidators', () => {
  describe('loginSchema', () => {
    it('deve validar dados de login válidos', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('deve falhar quando email estiver vazio', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email é obrigatório');
      }
    });

    it('deve falhar quando email for inválido', () => {
      const invalidData = {
        email: 'email-invalido',
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido');
      }
    });

    it('deve falhar quando senha estiver vazia', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha é obrigatória');
      }
    });

    it('deve falhar quando senha for menor que 6 caracteres', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha deve ter no mínimo 6 caracteres');
      }
    });

    it('deve aceitar senha com exatamente 6 caracteres', () => {
      const validData = {
        email: 'test@example.com',
        password: '123456',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('deve falhar quando email for undefined', () => {
      const invalidData = {
        email: undefined,
        password: 'password123',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('deve falhar quando senha for undefined', () => {
      const invalidData = {
        email: 'test@example.com',
        password: undefined,
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('deve validar dados de registro válidos', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        displayName: 'Test User',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('deve validar dados de registro sem displayName', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('deve falhar quando senhas não coincidirem', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
        displayName: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('As senhas não coincidem');
      }
    });

    it('deve falhar quando email estiver vazio', () => {
      const invalidData = {
        email: '',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('deve falhar quando senha for menor que 6 caracteres', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
        confirmPassword: '12345',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha deve ter no mínimo 6 caracteres');
      }
    });

    it('deve falhar quando senha for maior que 50 caracteres', () => {
      const longPassword = 'a'.repeat(51);
      const invalidData = {
        email: 'test@example.com',
        password: longPassword,
        confirmPassword: longPassword,
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Senha deve ter no máximo 50 caracteres');
      }
    });

    it('deve aceitar senha com exatamente 50 caracteres', () => {
      const maxPassword = 'a'.repeat(50);
      const validData = {
        email: 'test@example.com',
        password: maxPassword,
        confirmPassword: maxPassword,
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('deve falhar quando confirmação de senha estiver vazia', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: '',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Confirmação de senha é obrigatória');
      }
    });

    it('deve falhar quando email for inválido', () => {
      const invalidData = {
        email: 'email-invalido',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('deve validar email válido', () => {
      const validData = {
        email: 'test@example.com',
      };

      const result = forgotPasswordSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('deve falhar quando email estiver vazio', () => {
      const invalidData = {
        email: '',
      };

      const result = forgotPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email é obrigatório');
      }
    });

    it('deve falhar quando email for inválido', () => {
      const invalidData = {
        email: 'email-invalido',
      };

      const result = forgotPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Email inválido');
      }
    });

    it('deve falhar quando email for undefined', () => {
      const invalidData = {
        email: undefined,
      };

      const result = forgotPasswordSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('deve aceitar emails válidos com diferentes formatos', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@456.com',
      ];

      validEmails.forEach(email => {
        const result = forgotPasswordSchema.safeParse({ email });
        expect(result.success).toBe(true);
      });
    });

    it('deve rejeitar emails inválidos', () => {
      const invalidEmails = [
        'email',
        '@domain.com',
        'user@',
        'user@domain',
        'user..name@domain.com',
        'user@domain..com',
      ];

      invalidEmails.forEach(email => {
        const result = forgotPasswordSchema.safeParse({ email });
        expect(result.success).toBe(false);
      });
    });
  });
});
