import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true,
    unique: true

  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  }
});

usersSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

usersSchema.set('toJSON', {
  virtuals: true,
});

export const Users = mongoose.model('Users', usersSchema);