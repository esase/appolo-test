import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

// list of all features
import { 
  typeDef as Base, 
  resolvers as baseResolvers,
} from './features/base.js';

import { 
  typeDef as Author, 
  resolvers as authorResolvers,
} from './features/author.js';

import { 
  typeDef as Book, 
  resolvers as bookResolvers,
} from './features/book.js';

import { 
  typeDef as Comment, 
  resolvers as commentResolvers,
} from './features/comment.js';

const Query = `
  type Query {
    _empty: String
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [ 
    Query,
    Base, 
    Author, 
    Book,
    Comment
  ],
  resolvers: merge(
    {}, 
    baseResolvers,
    authorResolvers, 
    bookResolvers,
    commentResolvers
  )
});

