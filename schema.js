import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

// list of all features
import { 
  typeDef as Base, 
  resolvers as baseResolvers,
} from './features/base/schema';

import { 
  typeDef as Author, 
  resolvers as authorResolvers,
} from './features/author/schema';

import { 
  typeDef as Book, 
  resolvers as bookResolvers,
} from './features/book/schema';

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [ 
    Query,
    Mutation,
    Base, 
    Author, 
    Book
  ],
  resolvers: merge(
    {}, 
    baseResolvers,
    authorResolvers, 
    bookResolvers
  )
});

