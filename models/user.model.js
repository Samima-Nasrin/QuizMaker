const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // usernames must be unique
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizzes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Quiz', // reference to created quizzes
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', UserSchema);
