import { UserModel } from '../DAO/models/users.model.js';

export class UserService {
  validateUser(first_name, last_name, email) {
    if (!first_name || !last_name || !email) {
      console.log('validation error: please complete first_name, last_name and email.');
      throw new Error('validation error: please complete first_name, last_name and email.');
    }
  }
  async getAll() {
    const users = await UserModel.find({});
    return users;
  }

  async createOne(first_name, last_name, email) {
    this.validateUser(first_name, last_name, email);
    const userCreated = await UserModel.create({ first_name, last_name, email });
    return userCreated;
  }

  async deletedOne(_id) {
    const deleted = await UserModel.deleteOne({ _id: _id });
    return deleted;
  }

  async updateOne(_id, first_name, last_name, email) {
    if (!_id) throw new Error('invalid _id');
    this.validateUser(first_name, last_name, email);
    const userUptaded = await UserModel.updateOne({ _id: id }, { first_name, last_name, email });
    return userUptaded;
  }
}
