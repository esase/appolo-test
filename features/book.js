import allBooks from '../data/books.json';
import allAuthors from '../data/authors.json';
import allComments from '../data/comments.json';

export const typeDef = `
  extend type Query {
    books: [Book!],
    book(id: ID): Book
  }

  type Book implements Node {
    id: ID!
    title: String!
    author: Author!
    comments: [Comment!]
  }
`;

export const resolvers = {
    Query: {
        books: () => allBooks,
        book(parent, args, context, info) {
          return allBooks.find((book) => {
              return book.id == args.id;
          });
        },
    },
    Book: {
        // try to resolve a book's author
        author(obj, args, context, info) {
            return allAuthors.find((author) => {
                return author.id == obj.authorId;
            });
        },
        // try to resolve a book's list of comments
        comments(obj, args, context, info) {
            return allComments.filter((comment) => {
                return comment.bookId == obj.id;
            });
        }
    }
  };