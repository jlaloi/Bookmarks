import * as React from 'react';
import {ApolloProvider} from '@apollo/react-hooks';
import {client} from '../config/apolloClient';
import {BookmarkAdd} from './BookmarkAdd';
import {BookmarkList} from './BookmarkList';

const App = () => (
  <ApolloProvider client={client}>
    <BookmarkAdd />
    <BookmarkList />
  </ApolloProvider>
);

export default App;
