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

  const PORT = process.env.PORT || 3000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});
