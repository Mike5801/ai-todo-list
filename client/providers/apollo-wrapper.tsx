"use client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { ApolloLink, HttpLink } from "@apollo/client";
import { createClient } from "graphql-ws";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";

const GRAPHQL_WS_URL = process.env.NEXT_PUBLIC_GRAPHQL_WS || "";


function makeClient() {
  const wsLink = new GraphQLWsLink(createClient({
    url: GRAPHQL_WS_URL
  }));

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};
