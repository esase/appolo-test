import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import depthLimit from 'graphql-depth-limit';

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

const schema = makeExecutableSchema({
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

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  validationRules: [depthLimit(3)], // the maximum level of nested nodes
  // here we can provide any list of global settings
  context: () => ({ 
    someGlobalValue: 'test'
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
