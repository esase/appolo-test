
import { ApolloServer } from 'apollo-server';
import { schema } from './schema';
import mongoose from 'mongoose'
import depthLimit from 'graphql-depth-limit';

// connect to mongo
mongoose.Promise = global.Promise;

const mongoUrl = 'mongodb://localhost:27017/admin';

mongoose.connect(mongoUrl, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'root',
  pass: 'example'
});

mongoose.connection.once('open', () => {
  // connect to apollo server
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    validationRules: [depthLimit(3)], // the maximum level of nested nodes
  })

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});

