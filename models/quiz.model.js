const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswerIndex: {
        type: Number,
        required: true,
      },
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  responses: [ // ✅ NEW
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      score: {
        type: Number,
        required: true,
      },
      takenAt: {
        type: Date,
        default: Date.now,
      }
    }
  ]
});

module.exports = mongoose.model("Quiz", QuizSchema);
