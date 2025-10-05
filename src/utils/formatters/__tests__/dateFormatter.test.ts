import { formatDate, formatDateTime, getRelativeTime } from '../dateFormatter';

describe('dateFormatter', () => {
  describe('formatDate', () => {
    it('deve formatar data no formato brasileiro', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDate(date);
      
      expect(result).toBe('15/01/2024');
    });

    it('deve formatar data com zeros à esquerda', () => {
      const date = new Date('2024-01-05T10:30:00Z');
      const result = formatDate(date);
      
      expect(result).toBe('05/01/2024');
    });

    it('deve formatar data de dezembro', () => {
      const date = new Date('2024-12-25T10:30:00Z');
      const result = formatDate(date);
      
      expect(result).toBe('25/12/2024');
    });

    it('deve formatar data de ano diferente', () => {
      const date = new Date('2023-06-30T10:30:00Z');
      const result = formatDate(date);
      
      expect(result).toBe('30/06/2023');
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora no formato brasileiro', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/15\/01\/2024/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve formatar data e hora com zeros à esquerda', () => {
      const date = new Date('2024-01-05T09:05:00Z');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/05\/01\/2024/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve formatar meia-noite', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/14\/01\/2024/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve formatar meio-dia', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDateTime(date);
      
      expect(result).toMatch(/15\/01\/2024/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('getRelativeTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('deve retornar "agora" para data atual', () => {
      const now = new Date('2024-01-15T12:00:00Z');
      const result = getRelativeTime(now);
      
      expect(result).toBe('agora');
    });

    it('deve retornar "agora" para data muito recente', () => {
      const recent = new Date('2024-01-15T11:59:59Z');
      const result = getRelativeTime(recent);
      
      expect(result).toBe('agora');
    });

    it('deve retornar minutos corretamente', () => {
      const oneMinuteAgo = new Date('2024-01-15T11:59:00Z');
      const result = getRelativeTime(oneMinuteAgo);
      
      expect(result).toBe('há 1 minuto');
    });

    it('deve retornar minutos no plural', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
      const result = getRelativeTime(fiveMinutesAgo);
      
      expect(result).toBe('há 5 minutos');
    });

    it('deve retornar horas corretamente', () => {
      const oneHourAgo = new Date('2024-01-15T11:00:00Z');
      const result = getRelativeTime(oneHourAgo);
      
      expect(result).toBe('há 1 hora');
    });

    it('deve retornar horas no plural', () => {
      const threeHoursAgo = new Date('2024-01-15T09:00:00Z');
      const result = getRelativeTime(threeHoursAgo);
      
      expect(result).toBe('há 3 horas');
    });

    it('deve retornar dias corretamente', () => {
      const oneDayAgo = new Date('2024-01-14T12:00:00Z');
      const result = getRelativeTime(oneDayAgo);
      
      expect(result).toBe('há 1 dia');
    });

    it('deve retornar dias no plural', () => {
      const fiveDaysAgo = new Date('2024-01-10T12:00:00Z');
      const result = getRelativeTime(fiveDaysAgo);
      
      expect(result).toBe('há 5 dias');
    });

    it('deve priorizar dias sobre horas quando ambos são válidos', () => {
      const oneDayOneHourAgo = new Date('2024-01-14T11:00:00Z');
      const result = getRelativeTime(oneDayOneHourAgo);
      
      expect(result).toBe('há 1 dia');
    });

    it('deve priorizar horas sobre minutos quando ambos são válidos', () => {
      const oneHourOneMinuteAgo = new Date('2024-01-15T10:59:00Z');
      const result = getRelativeTime(oneHourOneMinuteAgo);
      
      expect(result).toBe('há 1 hora');
    });

    it('deve priorizar minutos sobre segundos', () => {
      const oneMinuteThirtySecondsAgo = new Date('2024-01-15T11:58:30Z');
      const result = getRelativeTime(oneMinuteThirtySecondsAgo);
      
      expect(result).toBe('há 1 minuto');
    });

    it('deve funcionar com datas futuras', () => {
      const future = new Date('2024-01-15T13:00:00Z');
      const result = getRelativeTime(future);
      
      expect(result).toBe('agora');
    });
  });
});
