import { Schema, model } from 'mongoose';
import monsoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';


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
  password: {
    type: String,
    required: true,
    max: 100,
  },
  rol: {
    type: String,
    required: true,
    default: "user"
  },
});

/* schema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    return next();
  }
}); */

schema.plugin(monsoosePaginate);
export const UserModel = model('users', schema);
