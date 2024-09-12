const express = require('express');
const { json } = require('express');
const { connect } = require('mongoose');
const cors = require('cors');
const { config } = require('dotenv');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./mean-client/graphql/schema.js');
const resolvers = require('./mean-client/graphql/resolvers.js');
const CronService = require('./mean-client/services/CronService.js');

config();  // Load environment variables
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(json());  // Parse JSON bodies

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
console.log('Attempting to connect to:', mongoUri.replace(/\/\/.*@/, '//<credentials>@'));

connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('ERROR:', err.message));

// Set up Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer();

// Initialize cron jobs
CronService.initCronJobs();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
});
