import { ProductRepository } from './products.repository.js';
import { AppError } from '../../config/error.handler.js';

class ProductServices {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getCategories() {
    try {
      const categories = await Product.distinct('category');
      return categories;
    } catch (error) {
      throw new AppError({ code: 500, message: 'Internal Server Error' });
    }
  }

  async getProductDetails(args) {
    const { productId } = args;
    try {
      const product = await this.productRepository.findProduct({ productId });
      if (!product) {
        throw new AppError({ code: 404, message: 'Product not found' });
      }
      return product;
    } catch (error) {
      throw new AppError({ code: 500, message: 'Internal Server Error' });
    }
  }

  async filterProducts(args) {
    try {
      const filteredProducts = await this.productRepository.findByFilter(args);
      return filteredProducts;
    } catch (error) {
      throw new AppError({ code: 500, message: 'Internal Server Error' });
    }
  }
}

export { ProductServices };
