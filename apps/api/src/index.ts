import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema/typeDefs';
import { resolvers } from './resolvers';

async function startServer() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
    console.log(`GraphQL at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
