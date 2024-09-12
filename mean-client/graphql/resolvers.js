const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const EmailPreference = require('../models/EmailPreference');
const AuthService = require('../services/AuthService');
const ProductService = require('../services/ProductService');
const OrderService = require('../services/OrderService');
const EmailService = require('../services/EmailService');

const resolvers = {
  Query: {
    getUser: (_, { id }) => User.findById(id),
    getProduct: (_, { id }) => Product.findById(id),
    getOrders: (_, { userId }) => Order.find({ userId }),
    getEmailPreference: (_, { userId }) => EmailPreference.findOne({ userId }),
  },
  Mutation: {
    registerUser: (_, args) => AuthService.registerUser(args),
    loginUser: (_, { email, password }) => AuthService.loginUser(email, password),
    createProduct: (_, args) => ProductService.createProduct(args),
    createOrder: (_, args) => OrderService.createOrder(args),
    updateEmailPreference: (_, args) => EmailService.updateEmailPreference(args),
  },
}; 

module.exports = resolvers;
