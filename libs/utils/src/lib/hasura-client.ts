import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import 'cross-fetch/polyfill';

const config = {
  hasuraAdminSecret: process.env['NEXT_PUBLIC_HASURA_ADMIN_SECRET'],
};

export const hasuraClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://forbes.hasura.app/v1/graphql',
    headers: {
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
  }),
  cache: new InMemoryCache(),
});
