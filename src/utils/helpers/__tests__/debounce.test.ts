import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve executar a função após o delay especificado', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    
    expect(mockFn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve cancelar execução anterior quando chamado novamente', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(50);
    
    debouncedFn();
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve passar argumentos corretamente para a função', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2', 123);
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });

  it('deve funcionar com função que retorna valor', () => {
    const mockFn = jest.fn().mockReturnValue('resultado');
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve funcionar com função sem argumentos', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledWith();
  });

  it('deve funcionar com múltiplas chamadas rápidas', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    jest.advanceTimersByTime(100);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve funcionar com delay de 0', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    jest.advanceTimersByTime(0);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve funcionar com delay muito pequeno', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 1);

    debouncedFn();
    jest.advanceTimersByTime(1);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('deve funcionar com delay muito grande', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 10000);

    debouncedFn();
    jest.advanceTimersByTime(9999);
    
    expect(mockFn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1);
    
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
