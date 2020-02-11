import { BookModel } from './mongo';
import { AuthorModel } from '../author/mongo';
import 'babel-polyfill';

export const typeDef = `
  extend type Query {
    books: [Book!],
    book(id: ID): Book
  }

  extend type Mutation {
    addBook(title: String!, authorId: String!): Book
  }

  type Book implements Node {
    id: ID!
    title: String!
    author: Author!
    #comments: [Comment!]
  }
`;

export const resolvers = {
    Query: {
        books: async () => await BookModel.find({}).exec(),
        book:  async(parent, args, context, info) => await BookModel.findById(args.id).exec(),
    },
    Mutation: {
      addBook: async (_, args) => {
        const author = await AuthorModel.findById(args.authorId).exec();

        if (!author) {
          throw Error('Author not found');
        }

        return await BookModel.create(args);
      }
    },
    Book: {
        // try to resolve a book's author
        author: async(obj, args, context, info) => await AuthorModel.findById(obj.authorId).exec()
        // // try to resolve a book's list of comments
        // comments(obj, args, context, info) {
        //     return allComments.filter((comment) => {
        //         return comment.bookId == obj.id;
        //     });
        // }
    }
  };