import allBooks from '../data/books.json';
import allComments from '../data/comments.json';

export const typeDef = `
  extend type Query {
    comments: [Comment!],
    comment(id: ID): Comment
  }

  type Comment implements Node {
    id: ID!
    message: String!
    oldMessage: String @deprecated(reason: "Use message field instead.")
    author: String,
    book: Book!
  }
`;

export const resolvers = {
    Query: {
      comments: () => allComments,
      comment(parent, args, context, info) {
        return allComments.find((comment) => {
            return comment.id == args.id;
        });
      }
    },
    Comment: {
      // try to resolve a comment's list of books
      book(obj, args, context, info) {
          return allBooks.find((book) => {
              return book.id == obj.bookId;
          });
      }
    }
  };