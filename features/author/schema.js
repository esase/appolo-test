import { AuthorModel } from './mongo';
import { BookModel } from '../book/mongo';
import 'babel-polyfill';

export const typeDef = `
  extend type Query {
    authors: [Author!],
    author(id: ID): Author
  }

  extend type Mutation {
    addAuthor(name: String!): Author
  }

  type Author implements Node {
    id: ID!
    name: String!
    books: [Book!]
  }
`;

export const resolvers = {
    Query: {
      authors: async () => await AuthorModel.find({}).exec(),
      author:  async(parent, args, context, info) => await AuthorModel.findById(args.id).exec(),
    },
    Mutation: {
      addAuthor: async (_, args) => await AuthorModel.create(args)
    },
    Author: {
      // try to resolve an author's list of books
      books: async(obj, args, context, info) => await BookModel.find({
        authorId: obj.id
      }).exec()
    }
};