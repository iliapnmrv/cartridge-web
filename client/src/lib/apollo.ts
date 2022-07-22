import { ApolloClient, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const apolloClient = new ApolloClient({
  uri: "http://localhost:8002/graphql/api",
  // uri: "http://mo4-it5:8002/graphql/api",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          workersPast: offsetLimitPagination(),
        },
      },
    },
  }),
});

export default apolloClient;
