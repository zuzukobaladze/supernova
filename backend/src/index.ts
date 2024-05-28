import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { Context, ConnectionParams } from './types/index.js';

dotenv.config();

const pubsub = new PubSub();
const db = new sqlite3.Database('./src/db/users.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  }
});

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Middleware for parsing JSON
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,
  })
);

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }): Promise<Context> => {
      const authHeader = req.headers.authorization || '';
      let user = null;

      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7); // Remove 'Bearer ' from the start
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
          user = { id: decoded.userId };
        } catch (e) {
          console.error('JWT verification error:', e);
        }
      }

      return { user, pubsub, db };
    },
  })
);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

useServer(
  {
    schema,
    context: async (ctx) => {
      const { connectionParams } = ctx as { connectionParams: ConnectionParams };
      let user = null;

      if (connectionParams && connectionParams.authToken) {
        try {
          const decoded = jwt.verify(connectionParams.authToken, process.env.JWT_SECRET as string) as { userId: string };
          user = { id: decoded.userId };
        } catch (e) {
          console.error('JWT verification error:', e);
        }
      }

      return { user, pubsub, db };
    },
  },
  wsServer
);

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
