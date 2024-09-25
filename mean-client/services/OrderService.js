const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const EmailService = require('./EmailService.js');

class OrderService {
  static async createOrder({ userId, productId }) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const seller = await User.findById(product.sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    const order = new Order({
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      status: 'pending'
    });
    await order.save();

    return order;
  }

  static async getOrders(userId) {
    return Order.find({ userId });
  }
}

module.exports = OrderService;