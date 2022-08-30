import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  role: {
    type: [String],
  },
  lecturerMod: {
    type: [String],
  },
  studentMod: {
    type: [String],
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
