import 'dotenv/config';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const placeholderTypeDefs = gql`
  type Query {
    _placeholder: String
  }
`;

const placeholderResolvers = {
  Query: {
    _placeholder: () => 'API is running',
  },
};

async function startServer() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const server = new ApolloServer({
    typeDefs: placeholderTypeDefs,
    resolvers: placeholderResolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
    console.log(`GraphQL at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
