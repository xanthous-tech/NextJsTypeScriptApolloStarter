import { ApolloClient, ApolloLink, InMemoryCache } from 'apollo-boost';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import { createUploadLink } from 'apollo-upload-client';
import fetch from 'isomorphic-unfetch';
import * as Client from '../graphql/client';

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, { getToken }) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const Cache = new InMemoryCache().restore(initialState || {});

  const httpLink = createUploadLink({
    uri: 'http://localhost:4000/graphql', // Server URL (must be absolute)
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  });

  const stateLink = withClientState({
    cache: Cache,
    defaults: Client.Defaults,
    resolvers: Client.Resolvers,
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once).
    link: ApolloLink.from([stateLink, authLink.concat(httpLink)]),
    cache: Cache,
  });
}

export default function initApollo(initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options);
  }

  return apolloClient;
}
