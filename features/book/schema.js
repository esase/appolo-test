import { BookModel } from './mongo';
import { AuthorModel } from '../author/mongo';
import 'babel-polyfill';

export const typeDef = `
  extend type Query {
    books: [Book!],
    book(id: ID): Book
  }

  extend type Mutation {
    addBook(title: String!, authorId: String!): Book,
    deleteBook(id: String!): Boolean
  }

  type Book implements Node {
    id: ID!
    title: String!
    author: Author!
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
      },
      deleteBook: async(_, args) =>  {
        const book = await BookModel.findById(args.id).exec();

        if (book) {
          await BookModel.findByIdAndDelete(args.id).exec();

          return true;
        }

        return false;
      }
    },
    Book: {
        // try to resolve a book's author
        author: async(obj, args, context, info) => await AuthorModel.findById(obj.authorId).exec()
    }
  };