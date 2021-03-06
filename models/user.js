import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'A password should be at least 8 characters long'],
  },
  createdAt: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
