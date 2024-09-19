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
  }

  type Query {
    getProducts: [Product]
    getProduct(id: ID!): Product
    getMyOrders: [Order]
    getMyProducts: [Product]
    getOrdersBySeller: [Order]
  }

  type Order {
    id: ID!
    userId: ID!
    productId: ID!
    quantity: Int!
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

  type Mutation {
    createProduct(name: String!, description: String, price: Float!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float): Product
    deleteProduct(id: ID!): Boolean
    registerUser(name: String!, email: String!, password: String!, role: String!): RegisterResponse!
    loginUser(email: String!, password: String!): LoginResponse!
    placeOrder(productId: ID!, quantity: Int!): Order
    updateOrderStatus(orderId: ID!, status: String!): Order
    confirmOrder(orderId: ID!): Order
    rejectOrder(orderId: ID!): Order
  }
`;

module.exports = typeDefs;
