const { ApolloServer, gql } = require('apollo-server');
const depthLimit  = require('graphql-depth-limit');
const allBooks    = require('./data/books.json');
const allAuthors  = require('./data/authors.json');
const allComments = require('./data/comments.json');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ENUM_VALUE
  
  # a root interface all types
  interface Node {
    id: ID!
  }

  type Author implements Node {
    id: ID!
    name: String!
    books: [Book!]
  }

  type Book implements Node {
    id: ID!
    title: String!
    author: Author!
    comments: [Comment!]
  }

  type Comment implements Node {
    id: ID!
    message: String!
    oldMessage: String @deprecated(reason: "Use message field instead.")
    author: String,
    book: Book!
  }

  type Query {
    authors: [Author!],
    author(id: ID): Author,
    books: [Book!],
    book(id: ID): Book,
    comments: [Comment!],
    comment(id: ID): Comment
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Book: {
        // try to resolve author
        author(obj, args, context, info) {
            return allAuthors.find((author) => {
                return author.id == obj.authorId;
            });
        },
        // try to resolve comments
        comments(obj, args, context, info) {
            return allComments.filter((comment) => {
                return comment.bookId == obj.id;
            });
        }
    },
    Author: {
        // try to resolve books
        books(obj, args, context, info) {
            return allBooks.filter((book) => {
                return book.authorId == obj.id;
            });
        }
    },
    Comment: {
        // try to resolve books
        book(obj, args, context, info) {
            // console.log(context.someGlobalValue);
            return allBooks.find((book) => {
                return book.id == obj.bookId;
            });
        }
    },
    Query: {
      authors: () => allAuthors,
      author(parent, args, context, info) {
        return allAuthors.find((author) => {
            return author.id == args.id;
        });
      },
      books: () => allBooks,
      book(parent, args, context, info) {
        return allBooks.find((book) => {
            return book.id == args.id;
        });
      },
      comments: () => allComments,
      comment(parent, args, context, info) {
        return allComments.find((comment) => {
            return comment.id == args.id;
        });
      },
    },
    Node: {
        __resolveType() {
          return null;
        }
    }
  }; 

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    introspection: true,
    playground: true,
    validationRules: [depthLimit(3)],
    context: () => ({ // here we can provide any list of global settings
      someGlobalValue: 'test'
    })
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});