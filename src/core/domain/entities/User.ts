export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  displayName?: string;
}