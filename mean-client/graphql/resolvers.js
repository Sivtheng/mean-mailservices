const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

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
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Validate password strength
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }

        // Validate role
        if (!['buyer', 'seller'].includes(role)) {
          throw new Error('Invalid role. Must be either "buyer" or "seller"');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        return {
          success: true,
          message: 'User registered successfully',
          user
        };
      } catch (error) {
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

        const tokenPayload = { userId: user._id, role: user.role };
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
      order.status = status;
      await order.save();
      return order;
    },
    confirmOrder: async (_, { orderId }, context) => {
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
        throw new Error('Access denied. You can only confirm orders for your products.');
      }
      order.status = 'confirmed';
      await order.save();
      return order;
    },
    rejectOrder: async (_, { orderId }, context) => {
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
        throw new Error('Access denied. You can only reject orders for your products.');
      }
      order.status = 'rejected';
      await order.save();
      return order;
    },
  },
};

module.exports = resolvers;
