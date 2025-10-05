import { AppError, ErrorCode, ErrorFactory } from '../AppError';

describe('AppError', () => {
  describe('constructor', () => {
    it('deve criar uma instância de AppError com valores padrão', () => {
      const error = new AppError('Erro de teste');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Erro de teste');
      expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(error.name).toBe('AppError');
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.originalError).toBeUndefined();
    });

    it('deve criar uma instância de AppError com código específico', () => {
      const error = new AppError('Erro de validação', ErrorCode.VALIDATION_ERROR);
      
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('deve criar uma instância de AppError com erro original', () => {
      const originalError = new Error('Erro original');
      const error = new AppError('Erro wrapper', ErrorCode.NETWORK_ERROR, originalError);
      
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('getUserMessage', () => {
    it('deve retornar mensagem específica para AUTHENTICATION_ERROR', () => {
      const error = new AppError('Erro de auth', ErrorCode.AUTHENTICATION_ERROR);
      expect(error.getUserMessage()).toBe('Email ou senha incorretos. Tente novamente.');
    });

    it('deve retornar mensagem específica para NETWORK_ERROR', () => {
      const error = new AppError('Erro de rede', ErrorCode.NETWORK_ERROR);
      expect(error.getUserMessage()).toBe('Erro de conexão. Verifique sua internet.');
    });

    it('deve retornar mensagem específica para VALIDATION_ERROR', () => {
      const error = new AppError('Campo obrigatório', ErrorCode.VALIDATION_ERROR);
      expect(error.getUserMessage()).toBe('Campo obrigatório');
    });

    it('deve retornar mensagem específica para UNAUTHORIZED', () => {
      const error = new AppError('Não autorizado', ErrorCode.UNAUTHORIZED);
      expect(error.getUserMessage()).toBe('Sessão expirada. Faça login novamente.');
    });

    it('deve retornar mensagem padrão para outros códigos', () => {
      const error = new AppError('Erro desconhecido', ErrorCode.UNKNOWN_ERROR);
      expect(error.getUserMessage()).toBe('Ocorreu um erro. Tente novamente.');
    });
  });

  describe('toJSON', () => {
    it('deve retornar objeto JSON com propriedades corretas', () => {
      const error = new AppError('Erro de teste', ErrorCode.VALIDATION_ERROR);
      const json = error.toJSON();
      
      expect(json).toEqual({
        name: 'AppError',
        message: 'Erro de teste',
        code: ErrorCode.VALIDATION_ERROR,
        timestamp: error.timestamp,
      });
    });
  });
});

describe('ErrorFactory', () => {
  describe('authenticationFailed', () => {
    it('deve criar AppError para falha de autenticação', () => {
      const error = ErrorFactory.authenticationFailed();
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
      expect(error.message).toBe('Falha na autenticação');
    });

    it('deve criar AppError para falha de autenticação com erro original', () => {
      const originalError = new Error('Original');
      const error = ErrorFactory.authenticationFailed(originalError);
      
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('networkError', () => {
    it('deve criar AppError para erro de rede', () => {
      const error = ErrorFactory.networkError();
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
      expect(error.message).toBe('Erro de conexão');
    });
  });

  describe('validationError', () => {
    it('deve criar AppError para erro de validação', () => {
      const error = ErrorFactory.validationError('Campo inválido');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Campo inválido');
    });
  });

  describe('unauthorized', () => {
    it('deve criar AppError para não autorizado', () => {
      const error = ErrorFactory.unauthorized();
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.message).toBe('Não autorizado');
    });
  });

  describe('handleFirebaseAuthError', () => {
    it('deve tratar auth/user-not-found', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/user-not-found' });
      expect(error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
    });

    it('deve tratar auth/wrong-password', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/wrong-password' });
      expect(error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
    });

    it('deve tratar auth/email-already-in-use', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/email-already-in-use' });
      expect(error.code).toBe(ErrorCode.REGISTRATION_ERROR);
      expect(error.message).toBe('Este email já está em uso');
    });

    it('deve tratar auth/weak-password', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/weak-password' });
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Senha muito fraca');
    });

    it('deve tratar auth/invalid-email', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/invalid-email' });
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Email inválido');
    });

    it('deve tratar auth/network-request-failed', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/network-request-failed' });
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    it('deve tratar auth/too-many-requests', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/too-many-requests' });
      expect(error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
      expect(error.message).toBe('Muitas tentativas. Tente novamente mais tarde');
    });

    it('deve tratar auth/user-disabled', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/user-disabled' });
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
      expect(error.message).toBe('Conta desabilitada');
    });

    it('deve tratar código desconhecido', () => {
      const error = ErrorFactory.handleFirebaseAuthError({ code: 'auth/unknown' });
      expect(error.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
    });
  });

  describe('handleFirestoreError', () => {
    it('deve tratar permission-denied', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'permission-denied' });
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    });

    it('deve tratar unavailable', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'unavailable' });
      expect(error.code).toBe(ErrorCode.NETWORK_ERROR);
    });

    it('deve tratar deadline-exceeded', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'deadline-exceeded' });
      expect(error.code).toBe(ErrorCode.TIMEOUT_ERROR);
      expect(error.message).toBe('Tempo limite excedido');
    });

    it('deve tratar not-found', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'not-found' });
      expect(error.code).toBe(ErrorCode.NOT_FOUND);
      expect(error.message).toBe('Recurso não encontrado');
    });

    it('deve tratar already-exists', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'already-exists' });
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Recurso já existe');
    });

    it('deve tratar failed-precondition', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'failed-precondition' });
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Condição prévia não atendida');
    });

    it('deve tratar out-of-range', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'out-of-range' });
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Valor fora do intervalo permitido');
    });

    it('deve tratar unimplemented', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'unimplemented' });
      expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Operação não implementada');
    });

    it('deve tratar internal', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'internal' });
      expect(error.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(error.message).toBe('Erro interno do servidor');
    });

    it('deve tratar código desconhecido do Firestore', () => {
      const error = ErrorFactory.handleFirestoreError({ code: 'unknown-firestore' });
      expect(error.code).toBe(ErrorCode.STORAGE_ERROR);
      expect(error.message).toBe('Erro no banco de dados');
    });
  });

  describe('handleGenericError', () => {
    it('deve retornar AppError se já for uma instância de AppError', () => {
      const appError = new AppError('Teste', ErrorCode.VALIDATION_ERROR);
      const result = ErrorFactory.handleGenericError(appError, 'contexto');
      
      expect(result).toBe(appError);
    });

    it('deve tratar erro com código auth/', () => {
      const error = { code: 'auth/user-not-found' };
      const result = ErrorFactory.handleGenericError(error, 'contexto');
      
      expect(result.code).toBe(ErrorCode.AUTHENTICATION_ERROR);
    });

    it('deve tratar erro com código firestore/', () => {
      const error = { code: 'firestore/permission-denied' };
      const result = ErrorFactory.handleGenericError(error, 'contexto');
      
      expect(result.code).toBe(ErrorCode.STORAGE_ERROR);
    });

    it('deve tratar erro genérico', () => {
      const error = { message: 'Erro genérico' };
      const result = ErrorFactory.handleGenericError(error, 'teste');
      
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.message).toBe('Erro em teste: Erro genérico');
    });

    it('deve tratar erro sem mensagem', () => {
      const error = {};
      const result = ErrorFactory.handleGenericError(error, 'teste');
      
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.message).toBe('Erro em teste: Erro desconhecido');
    });
  });
});
