import { Logger } from '../logger';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleInfo.mockRestore();
  });

  it('deve logar mensagem quando log for chamado', () => {
    Logger.log('Mensagem de teste');
    
    expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] Mensagem de teste');
  });

  it('deve logar mensagem com argumentos adicionais', () => {
    const obj = { test: 'value' };
    Logger.log('Mensagem', obj, 'string');
    
    expect(mockConsoleLog).toHaveBeenCalledWith('[LOG] Mensagem', obj, 'string');
  });

  it('deve logar warning quando warn for chamado', () => {
    Logger.warn('Aviso de teste');
    
    expect(mockConsoleWarn).toHaveBeenCalledWith('[WARN] Aviso de teste');
  });

  it('deve logar warning com argumentos adicionais', () => {
    const obj = { warning: 'value' };
    Logger.warn('Aviso', obj);
    
    expect(mockConsoleWarn).toHaveBeenCalledWith('[WARN] Aviso', obj);
  });

  it('deve logar erro quando error for chamado', () => {
    const error = new Error('Erro de teste');
    Logger.error('Erro ocorreu', error);
    
    expect(mockConsoleError).toHaveBeenCalledWith('[ERROR] Erro ocorreu', error);
  });

  it('deve logar erro sem objeto de erro', () => {
    Logger.error('Erro simples');
    
    expect(mockConsoleError).toHaveBeenCalledWith('[ERROR] Erro simples', undefined);
  });

  it('deve logar informação quando info for chamado', () => {
    Logger.info('Informação de teste');
    
    expect(mockConsoleInfo).toHaveBeenCalledWith('[INFO] Informação de teste');
  });

  it('deve logar informação com argumentos adicionais', () => {
    const data = { info: 'value' };
    Logger.info('Informação', data, 123);
    
    expect(mockConsoleInfo).toHaveBeenCalledWith('[INFO] Informação', data, 123);
  });
});
