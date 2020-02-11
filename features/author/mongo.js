
import mongoose from 'mongoose'

const { Schema } = mongoose;

const schema = new Schema({
  name: String
});

export const AuthorModel = mongoose.model('author', schema); 
