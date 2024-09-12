const Product = require('../models/Product');

class ProductService {
  static async createProduct({ name, description, price, sellerId }) {
    const product = new Product({ name, description, price, sellerId });
    await product.save();
    return product;
  }

  static async getProducts(filters = {}) {
    return Product.find(filters);
  }

  static async getProductById(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async updateProduct(productId, updates) {
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }
}

module.exports = ProductService;