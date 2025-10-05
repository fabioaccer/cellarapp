import { z } from 'zod';
import { VALIDATION } from '../constants';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatório')
        .email('Email inválido'),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(VALIDATION.MIN_PASSWORD_LENGTH, `Senha deve ter no mínimo ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`),
});

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatório')
        .email('Email inválido'),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(VALIDATION.MIN_PASSWORD_LENGTH, `Senha deve ter no mínimo ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`)
        .max(VALIDATION.MAX_PASSWORD_LENGTH, `Senha deve ter no máximo ${VALIDATION.MAX_PASSWORD_LENGTH} caracteres`),
    confirmPassword: z
        .string()
        .min(1, 'Confirmação de senha é obrigatória'),
    displayName: z
        .string()
        .optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatório')
        .email('Email inválido'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;