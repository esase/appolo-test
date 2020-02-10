
import { ApolloServer } from 'apollo-server';
import { schema } from './schema';
import depthLimit from 'graphql-depth-limit';

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
