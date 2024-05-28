import { PubSub } from 'graphql-subscriptions';
import sqlite3 from 'sqlite3';

export interface Context {
  user: { id: string } | null;
  pubsub: PubSub;
  db: sqlite3.Database;
}

export interface User {
  id: number;
  username: string;
  password: string;
  signInCount: number;
}

export interface SignInCount {
  count: number;
}

export interface ConnectionParams {
  authToken?: string;
}

