import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  // uri: "http://localhost:8002/graphql/api",
  uri: "http://mo4-it5:8002/graphql/api",
  cache: new InMemoryCache(),
});

export default apolloClient;
