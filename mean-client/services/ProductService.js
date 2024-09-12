const Product = require('../models/Product.js');

class ProductService {
  static async createProduct({ name, description, price }) {
    const product = new Product({ name, description, price });
    await product.save();
    return product;
  }

  static async getProduct(id) {
    return Product.findById(id);
  }
}

module.exports = ProductService;