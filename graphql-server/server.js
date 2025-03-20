const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const typeDefs = require('./schemas/tournament.server.schema');
const resolvers = require('./resolvers/tournament.server.resolvers');


async function startServer() {
  dotenv.config();

  const app = express();
  
  // Middleware
  app.use(cookieParser());
  app.use(express.json());
  // app.use(
  //     cors({
  //         origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5174'],
  //         credentials: true,
  //     })
  // );
  
  // Connect to MongoDB
  mongoose.connect('mongodb://0.0.0.0:27017/DenisjannReyes-lab-assignment2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
  // Create a new ApolloServer instance and pass the schema data
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  // Apply Apollo GraphQL middleware and specify the path to /graphql
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

startServer();
