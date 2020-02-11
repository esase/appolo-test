
import mongoose from 'mongoose'

const { Schema } = mongoose;

const schema = new Schema({
  title: String,
  authorId: String
});

export const BookModel = mongoose.model('book', schema); 
