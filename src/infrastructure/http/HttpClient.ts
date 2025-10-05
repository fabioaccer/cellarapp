import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppError, ErrorCode } from '../../core/errors/AppError';

export class HttpClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fakestoreapi.com',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                console.log(`[API] Response: ${response.status}`);
                return response;
            },
            (error) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: any): AppError {
        if (error.response) {
            const status = error.response.status;

            if (status === 404) {
                return new AppError('Recurso não encontrado', ErrorCode.NOT_FOUND, error);
            }

            if (status >= 500) {
                return new AppError('Erro no servidor', ErrorCode.NETWORK_ERROR, error);
            }

            return new AppError(
                error.response.data?.message || 'Erro na requisição',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }

        if (error.request) {
            return new AppError(
                'Sem conexão com o servidor',
                ErrorCode.NETWORK_ERROR,
                error
            );
        }

        if (error.code === 'ECONNABORTED') {
            return new AppError('Tempo de requisição esgotado', ErrorCode.TIMEOUT_ERROR, error);
        }

        return new AppError('Erro desconhecido', ErrorCode.UNKNOWN_ERROR, error);
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            throw error instanceof AppError ? error : this.handleError(error);
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error instanceof AppError ? error : this.handleError(error);
        }
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error instanceof AppError ? error : this.handleError(error);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw error instanceof AppError ? error : this.handleError(error);
        }
    }
}
