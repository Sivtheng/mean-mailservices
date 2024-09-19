const Order = require('../models/Order.js');
const EmailService = require('./EmailService.js');
const Product = require('../models/Product.js');

class OrderService {
  static async createOrder({ userId, productId }) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const order = new Order({
      userId,
      productId,
      productName: product.name,
      productPrice: product.price,
      status: 'pending'
    });
    await order.save();

    // Send order confirmation email to buyer
    await EmailService.sendOrderConfirmationEmail(order);

    // Send notification email to seller
    await EmailService.sendSellerNotificationEmail(order);

    return order;
  }

  static async getOrders(userId) {
    return Order.find({ userId });
  }
}

module.exports = OrderService;