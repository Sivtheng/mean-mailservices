const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
  }

  type Query {
    getProducts: [Product]
    getProduct(id: ID!): Product
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
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
  }
`;

module.exports = typeDefs;
