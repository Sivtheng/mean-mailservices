const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
  }

  type Order {
    id: ID!
    userId: ID!
    productId: ID!
    quantity: Int!
    status: String!
  }

  type EmailPreference {
    id: ID!
    userId: ID!
    newsletterOptIn: Boolean!
    allEmailsOptIn: Boolean!
  }

  type Query {
    getUser(id: ID!): User
    getProduct(id: ID!): Product
    getOrders(userId: ID!): [Order]
    getEmailPreference(userId: ID!): EmailPreference
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!, role: String!): User
    loginUser(email: String!, password: String!): String
    createProduct(name: String!, description: String!, price: Float!): Product
    createOrder(userId: ID!, productId: ID!, quantity: Int!): Order
    updateEmailPreference(userId: ID!, newsletterOptIn: Boolean!, allEmailsOptIn: Boolean!): EmailPreference
  }
`;

module.exports = typeDefs;
