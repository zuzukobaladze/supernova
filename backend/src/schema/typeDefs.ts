import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    signInCount: Int!
  }

  type Query {
    me: User
    globalSignInCount: Int
    globalSignInNotification: String
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    register(username: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Subscription {
    personalSignInCount: Int
    globalSignInNotification: String
    globalSignInCount: Int
  }
`;

export default typeDefs;
