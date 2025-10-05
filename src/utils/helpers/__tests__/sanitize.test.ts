import { sanitizeString, sanitizeEmail, stripHtml } from '../sanitize';

describe('sanitize', () => {
  describe('sanitizeString', () => {
    it('deve remover espaços extras e quebras de linha', () => {
      const input = '  texto   com   espaços  \n\n  extras  ';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto com espaços extras');
    });

    it('deve remover tabs e outros espaços em branco', () => {
      const input = '\ttexto\t\tcom\t\ttabs\t';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto com tabs');
    });

    it('deve preservar espaços simples entre palavras', () => {
      const input = 'texto normal com espaços';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto normal com espaços');
    });

    it('deve remover espaços do início e fim', () => {
      const input = '   texto   ';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto');
    });

    it('deve lidar com string vazia', () => {
      const input = '';
      const result = sanitizeString(input);
      
      expect(result).toBe('');
    });

    it('deve lidar com string só com espaços', () => {
      const input = '   \n\t   ';
      const result = sanitizeString(input);
      
      expect(result).toBe('');
    });

    it('deve lidar com múltiplas quebras de linha', () => {
      const input = 'texto\n\n\ncom\n\n\nquebras';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto com quebras');
    });

    it('deve preservar caracteres especiais', () => {
      const input = '  texto@#$%^&*()com   símbolos  ';
      const result = sanitizeString(input);
      
      expect(result).toBe('texto@#$%^&*()com símbolos');
    });
  });

  describe('sanitizeEmail', () => {
    it('deve converter email para minúsculas', () => {
      const input = 'TEST@EXAMPLE.COM';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('test@example.com');
    });

    it('deve remover espaços do início e fim', () => {
      const input = '  test@example.com  ';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('test@example.com');
    });

    it('deve converter email misto para minúsculas', () => {
      const input = 'Test.User@EXAMPLE.COM';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('test.user@example.com');
    });

    it('deve lidar com email já em minúsculas', () => {
      const input = 'test@example.com';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('test@example.com');
    });

    it('deve lidar com email com espaços internos', () => {
      const input = '  test @ example . com  ';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('test @ example . com');
    });

    it('deve lidar com string vazia', () => {
      const input = '';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('');
    });

    it('deve lidar com string só com espaços', () => {
      const input = '   ';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('');
    });

    it('deve preservar caracteres especiais do email', () => {
      const input = '  User.Name+Tag@Sub.Domain.COM  ';
      const result = sanitizeEmail(input);
      
      expect(result).toBe('user.name+tag@sub.domain.com');
    });
  });

  describe('stripHtml', () => {
    it('deve remover tags HTML simples', () => {
      const input = '<p>Texto com <strong>negrito</strong></p>';
      const result = stripHtml(input);
      
      expect(result).toBe('Texto com negrito');
    });

    it('deve remover todas as tags HTML', () => {
      const input = '<div><h1>Título</h1><p>Parágrafo com <em>ênfase</em></p></div>';
      const result = stripHtml(input);
      
      expect(result).toBe('TítuloParágrafo com ênfase');
    });

    it('deve preservar texto sem tags HTML', () => {
      const input = 'Texto simples sem tags';
      const result = stripHtml(input);
      
      expect(result).toBe('Texto simples sem tags');
    });

    it('deve lidar com tags aninhadas', () => {
      const input = '<div><span><strong>Texto</strong></span></div>';
      const result = stripHtml(input);
      
      expect(result).toBe('Texto');
    });

    it('deve lidar com tags auto-fechadas', () => {
      const input = '<img src="test.jpg" alt="teste"><br/>Texto';
      const result = stripHtml(input);
      
      expect(result).toBe('Texto');
    });

    it('deve lidar com atributos em tags', () => {
      const input = '<a href="http://example.com" target="_blank">Link</a>';
      const result = stripHtml(input);
      
      expect(result).toBe('Link');
    });

    it('deve lidar com string vazia', () => {
      const input = '';
      const result = stripHtml(input);
      
      expect(result).toBe('');
    });

    it('deve lidar com string só com tags', () => {
      const input = '<div><p></p></div>';
      const result = stripHtml(input);
      
      expect(result).toBe('');
    });

    it('deve lidar com tags malformadas', () => {
      const input = '<div>Texto <p não fechada';
      const result = stripHtml(input);
      
      expect(result).toContain('Texto');
    });

    it('deve lidar com múltiplas linhas', () => {
      const input = `<div>
        <h1>Título</h1>
        <p>Parágrafo</p>
      </div>`;
      const result = stripHtml(input);
      
      expect(result).toBe('\n        Título\n        Parágrafo\n      ');
    });

    it('deve lidar com caracteres especiais em tags', () => {
      const input = '<div class="test" data-value="123">Texto</div>';
      const result = stripHtml(input);
      
      expect(result).toBe('Texto');
    });
  });
});
