const express = require('express');
const http = require('http');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { json } = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const typeDefs = require('./mean-client/graphql/schema.js');
const resolvers = require('./mean-client/graphql/resolvers.js');
const CronService = require('./mean-client/services/CronService');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '.env' });

const app = express();
const httpServer = http.createServer(app);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    }),
  );

  // Initialize cron jobs
  CronService.initCronJobs();

  const PORT = process.env.GRAPHQL_PORT || 3000; // Use GRAPHQL_PORT if set, otherwise 3000
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`Using PORT: ${PORT}`);
}

startApolloServer();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Verification route
app.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await AuthService.verifyEmail(decoded.userId);
    res.send('Email verified successfully! You can now log in.');
  } catch (error) {
    res.status(400).send('Invalid or expired token.');
  }
});
