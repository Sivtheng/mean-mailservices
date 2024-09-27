# MEAN E-commerce Application

This is a full-stack e-commerce application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js). The application features user authentication, product management, order processing, and email notifications.

## Features

- User authentication (login, register, password reset)
- Role-based access control (buyer and seller roles)
- Product management (create, read, update, delete)
- Order processing
- Email notifications (order confirmations, newsletters)
- GraphQL API

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- MongoDB
- Angular CLI

## Installation

1. Install server dependencies:

   ```bash
   npm install
   ```

2. Install client dependencies:

   ```bash
   cd mean-client
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   SMTP_HOST=<your-smtp-host>
   SMTP_PORT=<your-smtp-port>
   SMTP_USER=<your-smtp-username>
   SMTP_PASS=<your-smtp-password>
   ```

## Running the Application

1. Start the server:

   ```bash
   npm run start:server
   ```

2. In a separate terminal, start the client:

   ```bash
   npm run start:client
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Development

- To run the server and client concurrently in development mode with auto-restart:

  ```bash
  npm start
  ```

## Project Structure

- `server.js`: Main server file
- `mean-client/`: Angular client application
- `models/`: MongoDB schemas
- `services/`: Business logic
- `graphql/`: GraphQL schema and resolvers
- `migrations/`: Database migration scripts

## API Documentation

The API uses GraphQL. You can explore the API using GraphQL Playground at `http://localhost:3000/graphql` when the server is running.
