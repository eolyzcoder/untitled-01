import { Product } from './products.schema.js';

class ProductRepository {
  async findProduct(args) {
    const { productId } = args;
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createProduct(args) {
    const { name, category, price, brand, size } = args;
    const productData = {
      name,
      category,
      price,
      brand,
      size,
    };

    try {
      const product = await new Product(productData).save();
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByFilter(args) {
    const { price, brand, size } = args;
    const filter = {};

    if (price) {
      filter.price = { $lte: parseInt(price) };
    }

    if (brand) {
      filter.brand = brand;
    }

    if (size) {
      filter.size = size;
    }

    try {
      const products = await Product.find(filter);
      return products;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findById(args) {
    const { productId } = args;
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      await Product.deleteOne({ _id: productId });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkForDuplicates(args) {
    // Implement as needed based on your business logic
  }
}

export { ProductRepository };
