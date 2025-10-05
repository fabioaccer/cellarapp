import { formatCurrency, formatBRL } from '../formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('deve formatar valor em USD por padrão', () => {
      const result = formatCurrency(100);
      
      expect(result).toBe('$100.00');
    });

    it('deve formatar valor em USD explicitamente', () => {
      const result = formatCurrency(100, 'USD');
      
      expect(result).toBe('$100.00');
    });

    it('deve formatar valor em EUR', () => {
      const result = formatCurrency(100, 'EUR');
      
      expect(result).toBe('€100.00');
    });

    it('deve formatar valor em GBP', () => {
      const result = formatCurrency(100, 'GBP');
      
      expect(result).toBe('£100.00');
    });

    it('deve formatar valor em JPY', () => {
      const result = formatCurrency(100, 'JPY');
      
      expect(result).toBe('¥100');
    });

    it('deve formatar valores decimais', () => {
      const result = formatCurrency(99.99);
      
      expect(result).toBe('$99.99');
    });

    it('deve formatar valores com muitos decimais', () => {
      const result = formatCurrency(99.999);
      
      expect(result).toBe('$100.00');
    });

    it('deve formatar valores zero', () => {
      const result = formatCurrency(0);
      
      expect(result).toBe('$0.00');
    });

    it('deve formatar valores negativos', () => {
      const result = formatCurrency(-100);
      
      expect(result).toBe('-$100.00');
    });

    it('deve formatar valores grandes', () => {
      const result = formatCurrency(1000000);
      
      expect(result).toBe('$1,000,000.00');
    });

    it('deve formatar valores muito pequenos', () => {
      const result = formatCurrency(0.01);
      
      expect(result).toBe('$0.01');
    });

    it('deve formatar valores com separadores de milhares', () => {
      const result = formatCurrency(1234567.89);
      
      expect(result).toBe('$1,234,567.89');
    });

    it('deve funcionar com diferentes moedas', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
      const value = 100;
      
      currencies.forEach(currency => {
        const result = formatCurrency(value, currency);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('formatBRL', () => {
    it('deve formatar valor em Real brasileiro', () => {
      const result = formatBRL(100);
      
      expect(result).toContain('R$');
      expect(result).toContain('100,00');
    });

    it('deve formatar valores decimais em Real', () => {
      const result = formatBRL(99.99);
      
      expect(result).toContain('R$');
      expect(result).toContain('99,99');
    });

    it('deve formatar valores com muitos decimais', () => {
      const result = formatBRL(99.999);
      
      expect(result).toContain('R$');
      expect(result).toContain('100,00');
    });

    it('deve formatar valores zero', () => {
      const result = formatBRL(0);
      
      expect(result).toContain('R$');
      expect(result).toContain('0,00');
    });

    it('deve formatar valores negativos', () => {
      const result = formatBRL(-100);
      
      expect(result).toContain('R$');
      expect(result).toContain('100,00');
    });

    it('deve formatar valores grandes', () => {
      const result = formatBRL(1000000);
      
      expect(result).toContain('R$');
      expect(result).toContain('1.000.000,00');
    });

    it('deve formatar valores muito pequenos', () => {
      const result = formatBRL(0.01);
      
      expect(result).toContain('R$');
      expect(result).toContain('0,01');
    });

    it('deve formatar valores com separadores de milhares', () => {
      const result = formatBRL(1234567.89);
      
      expect(result).toContain('R$');
      expect(result).toContain('1.234.567,89');
    });

    it('deve formatar valores com centavos', () => {
      const result = formatBRL(50.50);
      
      expect(result).toContain('R$');
      expect(result).toContain('50,50');
    });

    it('deve formatar valores inteiros', () => {
      const result = formatBRL(250);
      
      expect(result).toContain('R$');
      expect(result).toContain('250,00');
    });

    it('deve formatar valores com muitos dígitos', () => {
      const result = formatBRL(1234567890.12);
      
      expect(result).toContain('R$');
      expect(result).toContain('1.234.567.890,12');
    });

    it('deve formatar valores extremamente pequenos', () => {
      const result = formatBRL(0.001);
      
      expect(result).toContain('R$');
      expect(result).toContain('0,00');
    });

    it('deve formatar valores extremamente grandes', () => {
      const result = formatBRL(999999999999.99);
      
      expect(result).toContain('R$');
      expect(result).toContain('999.999.999.999,99');
    });

    it('deve usar vírgula como separador decimal', () => {
      const result = formatBRL(123.45);
      
      expect(result).toContain(',');
      expect(result).toContain('123,45');
    });

    it('deve usar ponto como separador de milhares', () => {
      const result = formatBRL(1234567);
      
      expect(result).toContain('.');
      expect(result).toContain('1.234.567');
    });

    it('deve sempre incluir o símbolo R$', () => {
      const values = [0, 1, 100, 999.99, -50];
      
      values.forEach(value => {
        const result = formatBRL(value);
        expect(result).toContain('R$');
      });
    });
  });
});
