import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import "cross-fetch/polyfill";

const config = {
  hasuraAdminSecret:
    "1PUTrZ2wj6H0Qsg8PK03Us0PNgU98vHW7FfXkGS7YmMMrQ0Tn7zO4a5LVfrqwb9j",
};

export const hasuraClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://forbes.hasura.app/v1/graphql",
    headers: {
      "x-hasura-admin-secret": config.hasuraAdminSecret,
    },
  }),
  cache: new InMemoryCache(),
});
