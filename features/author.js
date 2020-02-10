import allBooks from '../data/books.json';
import allAuthors from '../data/authors.json';

export const typeDef = `
  extend type Query {
    authors: [Author!],
    author(id: ID): Author
  }

  type Author implements Node {
    id: ID!
    name: String!
    books: [Book!]
  }
`;

export const resolvers = {
    Query: {
      authors: () => allAuthors,
      author(parent, args, context, info) {
        return allAuthors.find((author) => {
            return author.id == args.id;
        });
      }
    },
    Author: {
      // try to resolve an author's list of books
      books(obj, args, context, info) {
          return allBooks.filter((book) => {
              return book.authorId == obj.id;
          });
      }
    }
  };