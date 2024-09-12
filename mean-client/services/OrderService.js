const Order = require('../models/Order.js');
const EmailService = require('./EmailService.js');

class OrderService {
  static async createOrder({ userId, productId, quantity }) {
    const order = new Order({ userId, productId, quantity, status: 'pending' });
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