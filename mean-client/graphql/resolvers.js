const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const products = []; // This is a temporary in-memory store. Replace with database in production.

const resolvers = {
  Query: {
    getProducts: () => products,
    getProduct: (_, { id }) => products.find(product => product.id === id),
  },
  Mutation: {
    createProduct: (_, { name, description, price }) => {
      const newProduct = { id: String(products.length + 1), name, description, price };
      products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, { id, name, description, price }) => {
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return null;
      const updatedProduct = { ...products[index], name, description, price };
      products[index] = updatedProduct;
      return updatedProduct;
    },
    deleteProduct: (_, { id }) => {
      const index = products.findIndex(product => product.id === id);
      if (index === -1) return false;
      products.splice(index, 1);
      return true;
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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
  },
};

module.exports = resolvers;
