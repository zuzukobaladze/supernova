import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        signInCount
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
      user {
        id
        username
        signInCount
      }
    }
  }
`;

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
      signInCount
    }
  }
`;

export const GLOBAL_SIGNIN_COUNT_QUERY = gql`
  query globalSignInCount {
    globalSignInCount
  }
`;

export const GLOBAL_SIGNIN_COUNT_SUBSCRIPTION = gql`
  subscription globalSignInCount {
    globalSignInCount
  }
`;

export const GLOBAL_SIGNIN_NOTIFICATION_SUBSCRIPTION = gql`
  subscription globalSignInNotification {
    globalSignInNotification
  }
`;

export const PERSONAL_SIGNIN_COUNT_SUBSCRIPTION = gql`
  subscription personalSignInCount {
    personalSignInCount
  }
`;
