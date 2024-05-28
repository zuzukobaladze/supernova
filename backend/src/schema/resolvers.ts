import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import { IResolvers } from '@graphql-tools/utils';
import { Context, User } from '../types/index.js';
import { getUserById, getUserByUsername, getGlobalSignInCount } from '../db/database.js';

const pubsub = new PubSub();

const resolvers: IResolvers = {
  Query: {
    me: async (parent, args, context: Context): Promise<User | null> => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      try {
        const user = await getUserById(context.user.id);
        return user;
      } catch (err) {
        throw new Error('Failed to fetch user');
      }
    },
    globalSignInCount: async (parent, args, context: Context): Promise<number> => {
      try {
        return await getGlobalSignInCount();
      } catch (err) {
        throw new Error('Failed to fetch global sign-in count');
      }
    },
  },
  Mutation: {
    login: async (parent, { username, password }, context: Context): Promise<{ token: string; user: User }> => {
      try {
        const user = await getUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });

        await new Promise<void>((resolve, reject) => {
          context.db.run(
            "UPDATE users SET signInCount = signInCount + 1 WHERE id = ?",
            [user.id],
            function (err) {
              if (err) {
                reject(new Error('Database update failed'));
              } else {
                resolve();
              }
            }
          );
        });

        const updatedUser = await getUserById(user.id);
        if (!updatedUser) throw new Error('Failed to fetch updated user');

        pubsub.publish('PERSONAL_SIGNIN_COUNT', {
          personalSignInCount: updatedUser.signInCount,
        });

        const globalCount = await getGlobalSignInCount();
        pubsub.publish('GLOBAL_SIGNIN_COUNT', {
          globalSignInCount: globalCount,
        });
        if (globalCount >= 5) {
          pubsub.publish('GLOBAL_SIGNIN_NOTIFICATION', {
            globalSignInNotification: `Global sign-in count reached ${globalCount}!`,
          });
        }

        return { token, user: updatedUser };
      } catch (err) {
        throw err;
      }
    },
    register: async (parent, { username, password }, context: Context): Promise<{ token: string; user: User }> => {
      try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error(
            'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one digit.'
          );
        }

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
          throw new Error('Username already exists.');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const userId = await new Promise<number>((resolve, reject) => {
          context.db.run(
            "INSERT INTO users (username, password, signInCount) VALUES (?, ?, ?)",
            [username, hashedPassword, 1],
            function (err) {
              if (err) {
                reject(new Error('Database insert failed'));
              } else {
                resolve(this.lastID);
              }
            }
          );
        });

        const user = await getUserById(userId);
        if (!user) {
          throw new Error('Failed to fetch user after registration');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });

        pubsub.publish('PERSONAL_SIGNIN_COUNT', {
          personalSignInCount: user.signInCount,
        });

        const globalCount = await getGlobalSignInCount();
        pubsub.publish('GLOBAL_SIGNIN_COUNT', {
          globalSignInCount: globalCount,
        });
        if (globalCount >= 5) {
          pubsub.publish('GLOBAL_SIGNIN_NOTIFICATION', {
            globalSignInNotification: `Global sign-in count reached ${globalCount}!`,
          });
        }

        return { token, user };
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    personalSignInCount: {
      subscribe: () => pubsub.asyncIterator('PERSONAL_SIGNIN_COUNT'),
    },
    globalSignInCount: {
      subscribe: () => pubsub.asyncIterator('GLOBAL_SIGNIN_COUNT'),
    },
    globalSignInNotification: {
      subscribe: () => pubsub.asyncIterator('GLOBAL_SIGNIN_NOTIFICATION'),
    },
  },
};

export default resolvers;
