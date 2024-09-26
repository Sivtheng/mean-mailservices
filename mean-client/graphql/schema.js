const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    sellerId: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    isVerified: Boolean!
    newsletterOptIn: Boolean!
    allEmailsOptIn: Boolean!
  }

  type Query {
    getProducts: [Product]
    getProduct(id: ID!): Product
    getMyOrders: [Order]
    getMyProducts: [Product]
    getOrdersBySeller: [Order]
    getCurrentUser: User
  }

  type Order {
    id: ID!
    userId: ID!
    productId: ID!
    productName: String!
    productPrice: Float!
    status: String!
  }

  type RegisterResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type LoginResponse {
    success: Boolean!
    message: String!
    token: String
  }

  type ForgotPasswordResponse {
    success: Boolean!
    message: String!
  }

  type ResetPasswordResponse {
    success: Boolean!
    message: String!
  }

  type Mutation {
    createProduct(name: String!, description: String, price: Float!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float): Product
    deleteProduct(id: ID!): Boolean
    registerUser(name: String!, email: String!, password: String!, role: String!): RegisterResponse!
    loginUser(email: String!, password: String!): LoginResponse!
    placeOrder(productId: ID!): PlaceOrderResponse!
    updateOrderStatus(orderId: ID!, status: String!): Order
    forgotPassword(email: String!): ForgotPasswordResponse!
    resetPassword(resetToken: String!, newPassword: String!): ResetPasswordResponse!
    verifyEmail(userId: String!): VerificationResponse!
    updateEmailPreferences(newsletterOptIn: Boolean!, allEmailsOptIn: Boolean!): EmailPreferencesResponse!
    updateNewsletterSchedule(schedule: String!): Boolean
  }

  type VerificationResponse {
    success: Boolean!
    message: String!
  }

  type PlaceOrderResponse {
    success: Boolean!
    message: String!
    order: Order
  }

  type EmailPreferencesResponse {
    userId: ID!
    newsletterOptIn: Boolean!
    allEmailsOptIn: Boolean!
  }
`;

module.exports = typeDefs;
