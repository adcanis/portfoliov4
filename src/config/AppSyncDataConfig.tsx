import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";
import awsconfig from "../aws-exports";

const httpLink = createHttpLink({
  uri: awsconfig.aws_appsync_graphqlEndpoint as string,
});

const authLink = ApolloLink.from([
  createAuthLink({
    url: awsconfig.aws_appsync_graphqlEndpoint as string,
    region: awsconfig.aws_appsync_region,
    auth: {
      type: "AWS_LAMBDA",
      token: process.env.NEXT_PUBLIC_LAMBDA_AUTH_KEY as string,
    },
  }),
  httpLink,
]);

export const client = new ApolloClient({
  link: authLink,
  cache: new InMemoryCache(),
});

export default function AppSyncDataProvider({ children }: any) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
