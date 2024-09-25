const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const AuthService = require('../services/AuthService');

const authenticateUser = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error('Authentication token is required');
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    throw new Error('Invalid/Expired token');
  }
};

const resolvers = {
  Query: {
    getProducts: async () => {
      return await Product.find();
    },
    getProduct: async (_, { id }) => {
      return await Product.findById(id);
    },
    getMyOrders: async (_, __, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'buyer') {
        throw new Error('Access denied. Buyers only.');
      }
      return await Order.find({ userId: user.userId });
    },
    getMyProducts: async (_, __, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      return await Product.find({ sellerId: user.userId });
    },
    getOrdersBySeller: async (_, __, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      const products = await Product.find({ sellerId: user.userId });
      const productIds = products.map(product => product._id);
      return await Order.find({ productId: { $in: productIds } });
    },
  },
  Mutation: {
    createProduct: async (_, { name, description, price }, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      const product = new Product({ name, description, price, sellerId: user.userId });
      await product.save();
      return product;
    },
    updateProduct: async (_, { id, name, description, price }, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      const product = await Product.findOneAndUpdate(
        { _id: id, sellerId: user.userId },
        { name, description, price },
        { new: true }
      );
      if (!product) {
        throw new Error('Product not found or you do not have permission to update it');
      }
      return product;
    },
    deleteProduct: async (_, { id }, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      const result = await Product.deleteOne({ _id: id, sellerId: user.userId });
      return result.deletedCount > 0;
    },
    registerUser: async (_, { name, email, password, role }) => {
      console.log('Received registration request for:', email);
      try {
        const user = await AuthService.registerUser({ name, email, password, role });
        console.log('User registered successfully:', user.email);
        return {
          success: true,
          message: 'User registered successfully',
          user
        };
      } catch (error) {
        console.error('Error during user registration:', error);
        return {
          success: false,
          message: error.message,
          user: null
        };
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        const tokenPayload = { userId: user._id, role: user.role, isVerified: user.isVerified };
        console.log('Token payload:', tokenPayload);
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return {
          success: true,
          message: 'Login successful',
          token
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          token: null
        };
      }
    },
    placeOrder: async (_, { productId }, context) => {
      try {
        const user = authenticateUser(context);
        if (user.role !== 'buyer') {
          throw new Error('Access denied. Buyers only.');
        }
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error('Product not found');
        }
        const order = new Order({
          userId: user.userId,
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          status: 'pending'
        });
        await order.save();
        return order;
      } catch (error) {
        console.error('Server-side error in placeOrder:', error);
        throw error;
      }
    },
    updateOrderStatus: async (_, { orderId, status }, context) => {
      const user = authenticateUser(context);
      if (user.role !== 'seller') {
        throw new Error('Access denied. Sellers only.');
      }
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const product = await Product.findById(order.productId);
      if (product.sellerId.toString() !== user.userId) {
        throw new Error('Access denied. You can only update orders for your products.');
      }
      if (!['pending', 'completed', 'cancelled'].includes(status)) {
        throw new Error('Invalid status');
      }
      order.status = status;
      await order.save();
      return order;
    },
    forgotPassword: async (_, { email }) => {
      console.log('Received forgotPassword request for email:', email);
      try {
        const result = await AuthService.forgotPassword(email);
        console.log('ForgotPassword result:', result);
        return {
          success: true,
          message: result.message
        };
      } catch (error) {
        console.error('Error in forgotPassword resolver:', error);
        return {
          success: false,
          message: error.message
        };
      }
    },
    resetPassword: async (_, { resetToken, newPassword }) => {
      console.log('Received resetPassword request with token:', resetToken);
      try {
        const result = await AuthService.resetPassword(resetToken, newPassword);
        console.log('ResetPassword result:', result);
        return {
          success: true,
          message: result.message
        };
      } catch (error) {
        console.error('Error in resetPassword resolver:', error);
        return {
          success: false,
          message: error.message
        };
      }
    },
    verifyEmail: async (_, { userId }) => {
      console.log('Received verifyEmail request for userId:', userId);
      try {
        const user = await User.findById(userId);
        console.log('Found user:', user);
        if (!user) {
          return { success: false, message: 'User not found' };
        }
        if (user.isVerified) {
          console.log('User already verified');
          return { success: true, message: 'Email already verified' };
        }
        user.isVerified = true;
        await user.save();
        console.log('User verified successfully');
        return { success: true, message: 'Email verified successfully' };
      } catch (error) {
        console.error('Error verifying email:', error);
        return { success: false, message: error.message };
      }
    },
  },
};

module.exports = resolvers;
