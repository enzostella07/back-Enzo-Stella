//@ts-check
import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';

const schema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100,
  },
  last_name: {
    type: String,
    required: true,
    max: 100,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  pass: {
    type: String,
    required: true,
    max: 100,
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
});
schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);
