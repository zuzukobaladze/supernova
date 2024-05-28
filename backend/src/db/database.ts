import sqlite3 from 'sqlite3';
import { User, SignInCount } from '../types';

const db = new sqlite3.Database('./src/db/users.db', (err) => {
  if (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        signInCount INTEGER DEFAULT 0
      )
    `, (err) => {
      if (err) {
        console.error('Failed to create users table', err);
        process.exit(1);
      }
    });
  }
});

export const getUserById = (id: string | number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) {
        reject(new Error('Database query failed'));
      } else {
        resolve(row as User);
      }
    });
  });
};

export const getUserByUsername = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        reject(new Error('Database query failed'));
      } else {
        resolve(row as User);
      }
    });
  });
};

export const getGlobalSignInCount = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT SUM(signInCount) as count FROM users", (err, row) => {
      if (err) {
        reject(new Error('Database query failed'));
      } else {
        resolve((row as SignInCount).count);
      }
    });
  });
};

export default db;
