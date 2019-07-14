import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {API_KEY_GRAPHCOOL} from './keys';

const link = createHttpLink({uri: `https://api.graph.cool/simple/v1/${API_KEY_GRAPHCOOL}`});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
