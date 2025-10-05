import { GetProductsUseCase } from '../GetProductsUseCase';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { AppError, ErrorCode } from '../../../errors/AppError';

describe('GetProductsUseCase', () => {
  let getProductsUseCase: GetProductsUseCase;
  let mockProductRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockProductRepository = {
      getAll: jest.fn(),
      getByCategory: jest.fn(),
      getById: jest.fn(),
      getCategories: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    getProductsUseCase = new GetProductsUseCase(mockProductRepository);
  });

  describe('execute', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Produto 1',
        price: 100,
        description: 'Descrição do produto 1',
        category: 'categoria1',
        image: 'image1.jpg',
      },
      {
        id: 2,
        title: 'Produto 2',
        price: 200,
        description: 'Descrição do produto 2',
        category: 'categoria2',
        image: 'image2.jpg',
      },
    ];

    it('deve retornar todos os produtos quando categoria não for especificada', async () => {
      mockProductRepository.getAll.mockResolvedValue(mockProducts);

      const result = await getProductsUseCase.execute();

      expect(result).toEqual(mockProducts);
      expect(mockProductRepository.getAll).toHaveBeenCalled();
      expect(mockProductRepository.getByCategory).not.toHaveBeenCalled();
    });

    it('deve retornar produtos por categoria quando categoria for especificada', async () => {
      const category = 'categoria1';
      const categoryProducts = [mockProducts[0]];
      mockProductRepository.getByCategory.mockResolvedValue(categoryProducts);

      const result = await getProductsUseCase.execute(category);

      expect(result).toEqual(categoryProducts);
      expect(mockProductRepository.getByCategory).toHaveBeenCalledWith(category);
      expect(mockProductRepository.getAll).not.toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há produtos', async () => {
      mockProductRepository.getAll.mockResolvedValue([]);

      const result = await getProductsUseCase.execute();

      expect(result).toEqual([]);
      expect(mockProductRepository.getAll).toHaveBeenCalled();
    });

    it('deve retornar lista vazia quando não há produtos na categoria', async () => {
      const category = 'categoria-inexistente';
      mockProductRepository.getByCategory.mockResolvedValue([]);

      const result = await getProductsUseCase.execute(category);

      expect(result).toEqual([]);
      expect(mockProductRepository.getByCategory).toHaveBeenCalledWith(category);
    });

    it('deve retornar lista com um produto', async () => {
      const singleProduct = [mockProducts[0]];
      mockProductRepository.getAll.mockResolvedValue(singleProduct);

      const result = await getProductsUseCase.execute();

      expect(result).toEqual(singleProduct);
      expect(result).toHaveLength(1);
    });

    it('deve retornar lista com muitos produtos', async () => {
      const manyProducts = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        title: `Produto ${index + 1}`,
        price: (index + 1) * 10,
        description: `Descrição do produto ${index + 1}`,
        category: `categoria${(index % 5) + 1}`,
        image: `image${index + 1}.jpg`,
      }));
      
      mockProductRepository.getAll.mockResolvedValue(manyProducts);

      const result = await getProductsUseCase.execute();

      expect(result).toEqual(manyProducts);
      expect(result).toHaveLength(50);
    });

    it('deve lançar AppError quando getAll falhar', async () => {
      const error = new Error('Erro de rede');
      mockProductRepository.getAll.mockRejectedValue(error);

      await expect(getProductsUseCase.execute()).rejects.toThrow(AppError);
      await expect(getProductsUseCase.execute()).rejects.toMatchObject({
        code: ErrorCode.NETWORK_ERROR,
        message: 'Falha ao buscar produtos',
      });
    });

    it('deve lançar AppError quando getByCategory falhar', async () => {
      const category = 'categoria1';
      const error = new Error('Erro de rede');
      mockProductRepository.getByCategory.mockRejectedValue(error);

      await expect(getProductsUseCase.execute(category)).rejects.toThrow(AppError);
      await expect(getProductsUseCase.execute(category)).rejects.toMatchObject({
        code: ErrorCode.NETWORK_ERROR,
        message: 'Falha ao buscar produtos',
      });
    });

    it('deve preservar o erro original quando getAll falhar', async () => {
      const originalError = new Error('Erro de rede');
      mockProductRepository.getAll.mockRejectedValue(originalError);

      try {
        await getProductsUseCase.execute();
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(originalError);
      }
    });

    it('deve preservar o erro original quando getByCategory falhar', async () => {
      const category = 'categoria1';
      const originalError = new Error('Erro de rede');
      mockProductRepository.getByCategory.mockRejectedValue(originalError);

      try {
        await getProductsUseCase.execute(category);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).originalError).toBe(originalError);
      }
    });

    it('deve funcionar com diferentes tipos de categoria', async () => {
      const categories = ['categoria1', 'CATEGORIA2', 'categoria-3', 'categoria_4', 'categoria 5'];
      
      for (const category of categories) {
        mockProductRepository.getByCategory.mockResolvedValue([]);

        const result = await getProductsUseCase.execute(category);

        expect(result).toEqual([]);
        expect(mockProductRepository.getByCategory).toHaveBeenCalledWith(category);
      }
    });

    it('deve funcionar com categoria não vazia', async () => {
      const category = 'categoria-teste';
      mockProductRepository.getByCategory.mockResolvedValue([]);

      const result = await getProductsUseCase.execute(category);

      expect(mockProductRepository.getByCategory).toHaveBeenCalledWith(category);
      expect(result).toEqual([]);
    });

    it('deve retornar produtos com propriedades completas', async () => {
      const completeProduct: Product = {
        id: 999,
        title: 'Produto Completo',
        price: 999.99,
        description: 'Descrição completa do produto com muitos detalhes',
        category: 'categoria-especial',
        image: 'https://example.com/image.jpg',
      };
      
      mockProductRepository.getAll.mockResolvedValue([completeProduct]);

      const result = await getProductsUseCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(completeProduct);
      expect(result[0].id).toBe(999);
      expect(result[0].title).toBe('Produto Completo');
      expect(result[0].price).toBe(999.99);
      expect(result[0].description).toBe('Descrição completa do produto com muitos detalhes');
      expect(result[0].category).toBe('categoria-especial');
      expect(result[0].image).toBe('https://example.com/image.jpg');
    });

    it('deve lidar com produtos com valores extremos', async () => {
      const extremeProducts: Product[] = [
        {
          id: 0,
          title: '',
          price: 0,
          description: '',
          category: '',
          image: '',
        },
        {
          id: Number.MAX_SAFE_INTEGER,
          title: 'A'.repeat(1000),
          price: Number.MAX_VALUE,
          description: 'B'.repeat(10000),
          category: 'C'.repeat(500),
          image: 'D'.repeat(1000),
        },
      ];
      
      mockProductRepository.getAll.mockResolvedValue(extremeProducts);

      const result = await getProductsUseCase.execute();

      expect(result).toEqual(extremeProducts);
      expect(result).toHaveLength(2);
    });
  });
});
