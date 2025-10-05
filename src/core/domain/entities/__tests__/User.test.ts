import { User, AuthCredentials, RegisterData } from '../User';

describe('User Entity', () => {
  describe('User interface', () => {
    it('should create a valid User object with all fields', () => {
      const user: User = {
        id: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2023-01-01T00:00:00Z')
      };

      expect(user.id).toBe('user123');
      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('Test User');
      expect(user.photoURL).toBe('https://example.com/photo.jpg');
      expect(user.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
    });

    it('should create a valid User object with optional fields undefined', () => {
      const user: User = {
        id: 'user456',
        email: 'minimal@example.com',
        createdAt: new Date('2023-01-02T00:00:00Z')
      };

      expect(user.id).toBe('user456');
      expect(user.email).toBe('minimal@example.com');
      expect(user.displayName).toBeUndefined();
      expect(user.photoURL).toBeUndefined();
      expect(user.createdAt).toEqual(new Date('2023-01-02T00:00:00Z'));
    });

    it('should handle different user scenarios', () => {
      const userWithDisplayName: User = {
        id: 'user789',
        email: 'display@example.com',
        displayName: 'Display Name Only',
        createdAt: new Date()
      };

      const userWithPhoto: User = {
        id: 'user101',
        email: 'photo@example.com',
        photoURL: 'https://example.com/avatar.jpg',
        createdAt: new Date()
      };

      expect(userWithDisplayName.displayName).toBe('Display Name Only');
      expect(userWithDisplayName.photoURL).toBeUndefined();
      
      expect(userWithPhoto.photoURL).toBe('https://example.com/avatar.jpg');
      expect(userWithPhoto.displayName).toBeUndefined();
    });
  });

  describe('AuthCredentials interface', () => {
    it('should create valid AuthCredentials', () => {
      const credentials: AuthCredentials = {
        email: 'auth@example.com',
        password: 'securePassword123'
      };

      expect(credentials.email).toBe('auth@example.com');
      expect(credentials.password).toBe('securePassword123');
    });

    it('should handle different email formats', () => {
      const credentials1: AuthCredentials = {
        email: 'user@domain.com',
        password: 'password1'
      };

      const credentials2: AuthCredentials = {
        email: 'test.user+tag@subdomain.example.org',
        password: 'password2'
      };

      expect(credentials1.email).toBe('user@domain.com');
      expect(credentials2.email).toBe('test.user+tag@subdomain.example.org');
    });

    it('should handle different password scenarios', () => {
      const shortPassword: AuthCredentials = {
        email: 'test@example.com',
        password: '123'
      };

      const longPassword: AuthCredentials = {
        email: 'test@example.com',
        password: 'veryLongAndSecurePassword123!@#$%'
      };

      expect(shortPassword.password).toBe('123');
      expect(longPassword.password).toBe('veryLongAndSecurePassword123!@#$%');
    });
  });

  describe('RegisterData interface', () => {
    it('should create valid RegisterData with all fields', () => {
      const registerData: RegisterData = {
        email: 'register@example.com',
        password: 'registerPassword123',
        displayName: 'Register User'
      };

      expect(registerData.email).toBe('register@example.com');
      expect(registerData.password).toBe('registerPassword123');
      expect(registerData.displayName).toBe('Register User');
    });

    it('should create valid RegisterData without displayName', () => {
      const registerData: RegisterData = {
        email: 'minimal@example.com',
        password: 'minimalPassword'
      };

      expect(registerData.email).toBe('minimal@example.com');
      expect(registerData.password).toBe('minimalPassword');
      expect(registerData.displayName).toBeUndefined();
    });

    it('should extend AuthCredentials correctly', () => {
      const authCredentials: AuthCredentials = {
        email: 'auth@example.com',
        password: 'authPassword'
      };

      const registerData: RegisterData = {
        ...authCredentials,
        displayName: 'Extended User'
      };

      expect(registerData.email).toBe(authCredentials.email);
      expect(registerData.password).toBe(authCredentials.password);
      expect(registerData.displayName).toBe('Extended User');
    });

    it('should handle different registration scenarios', () => {
      const socialUser: RegisterData = {
        email: 'social@example.com',
        password: 'socialPassword',
        displayName: 'Social Media User'
      };

      const businessUser: RegisterData = {
        email: 'business@company.com',
        password: 'businessPassword123',
        displayName: 'Business Account'
      };

      expect(socialUser.displayName).toBe('Social Media User');
      expect(businessUser.displayName).toBe('Business Account');
      expect(businessUser.email).toContain('company.com');
    });
  });
});
