import { HttpClient } from '../HttpClient';
import { AppError, ErrorCode } from '../../../core/errors/AppError';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as any;

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Mock console.log to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    httpClient = new HttpClient();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('get', () => {
    const url = '/test';
    const mockData = { id: 1, name: 'Test' };

    it('should make GET request successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await httpClient.get(url);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(url, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make GET request with config', async () => {
      const config: AxiosRequestConfig = { params: { limit: 10 } };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await httpClient.get(url, config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(url, config);
      expect(result).toEqual(mockData);
    });

    it('should throw AppError when request fails', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get(url)).rejects.toThrow(AppError);
    });
  });

  describe('post', () => {
    const url = '/test';
    const postData = { name: 'New Item' };
    const mockData = { id: 1, ...postData };

    it('should make POST request successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post(url, postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(url, postData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make POST request with config', async () => {
      const config: AxiosRequestConfig = { headers: { 'Authorization': 'Bearer token' } };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post(url, postData, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(url, postData, config);
      expect(result).toEqual(mockData);
    });

    it('should make POST request without data', async () => {
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await httpClient.post(url);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(url, undefined, undefined);
      expect(result).toEqual(mockData);
    });

    it('should throw AppError when request fails', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(httpClient.post(url, postData)).rejects.toThrow(AppError);
    });
  });

  describe('put', () => {
    const url = '/test/1';
    const putData = { name: 'Updated Item' };
    const mockData = { id: 1, ...putData };

    it('should make PUT request successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await httpClient.put(url, putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(url, putData, undefined);
      expect(result).toEqual(mockData);
    });

    it('should make PUT request with config', async () => {
      const config: AxiosRequestConfig = { headers: { 'Authorization': 'Bearer token' } };
      const mockResponse: AxiosResponse = {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await httpClient.put(url, putData, config);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(url, putData, config);
      expect(result).toEqual(mockData);
    });

    it('should throw AppError when request fails', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.put.mockRejectedValue(error);

      await expect(httpClient.put(url, putData)).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    const url = '/test/1';

    it('should make DELETE request successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await httpClient.delete(url);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(url, undefined);
      expect(result).toEqual({ success: true });
    });

    it('should make DELETE request with config', async () => {
      const config: AxiosRequestConfig = { headers: { 'Authorization': 'Bearer token' } };
      const mockResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await httpClient.delete(url, config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(url, config);
      expect(result).toEqual({ success: true });
    });

    it('should throw AppError when request fails', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.delete.mockRejectedValue(error);

      await expect(httpClient.delete(url)).rejects.toThrow(AppError);
    });
  });

  describe('error handling', () => {
    it('should handle 404 error', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Recurso não encontrado');
        expect((err as AppError).code).toBe(ErrorCode.NOT_FOUND);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle 500 error', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Erro no servidor');
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle 400 error with custom message', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Bad request');
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle 400 error without custom message', async () => {
      const error = {
        response: {
          status: 400,
          data: {},
        },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Erro na requisição');
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle network error (no response)', async () => {
      const error = {
        request: {},
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Sem conexão com o servidor');
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle timeout error', async () => {
      const error = {
        code: 'ECONNABORTED',
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Tempo de requisição esgotado');
        expect((err as AppError).code).toBe(ErrorCode.TIMEOUT_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });

    it('should handle unknown error', async () => {
      const error = new Error('Unknown error');
      mockAxiosInstance.get.mockRejectedValue(error);

      try {
        await httpClient.get('/test');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).message).toBe('Erro desconhecido');
        expect((err as AppError).code).toBe(ErrorCode.UNKNOWN_ERROR);
        expect((err as AppError).originalError).toBe(error);
      }
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete CRUD workflow', async () => {
      // Create
      const createData = { name: 'New Item' };
      const createdItem = { id: 1, ...createData };
      mockAxiosInstance.post.mockResolvedValue({
        data: createdItem,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      });

      const createResult = await httpClient.post('/items', createData);
      expect(createResult).toEqual(createdItem);

      // Read
      mockAxiosInstance.get.mockResolvedValue({
        data: createdItem,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const readResult = await httpClient.get('/items/1');
      expect(readResult).toEqual(createdItem);

      // Update
      const updateData = { name: 'Updated Item' };
      const updatedItem = { id: 1, ...updateData };
      mockAxiosInstance.put.mockResolvedValue({
        data: updatedItem,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const updateResult = await httpClient.put('/items/1', updateData);
      expect(updateResult).toEqual(updatedItem);

      // Delete
      mockAxiosInstance.delete.mockResolvedValue({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const deleteResult = await httpClient.delete('/items/1');
      expect(deleteResult).toEqual({ success: true });
    });

    it('should handle different error scenarios', async () => {
      // Test 404 error
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 404, data: { message: 'Not found' } },
      });

      try {
        await httpClient.get('/nonexistent');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NOT_FOUND);
      }

      // Test 500 error
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Server error' } },
      });

      try {
        await httpClient.get('/server-error');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.NETWORK_ERROR);
      }

      // Test timeout error
      mockAxiosInstance.get.mockRejectedValueOnce({
        code: 'ECONNABORTED',
      });

      try {
        await httpClient.get('/timeout');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe(ErrorCode.TIMEOUT_ERROR);
      }
    });
  });
});