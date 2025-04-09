
// import mongoose from 'mongoose';

// const ResultSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   scores: [
//     {
//       type: Number,
//       required: true,
//     },
//   ],
//   attempts: [
//     {
//       score: { type: Number, required: true },
//       date: { type: Date, default: Date.now },
//     },
//   ],
// });

// export default mongoose.models.Result || mongoose.model('Result', ResultSchema);

import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // To prevent duplicate entries for the same email
  },
  knowledgeArea: {
    type: String,
    // required: true,
  },
  scores: [
    {
      type: Number,
      required: true,
    },
  ],
  attempts: [
    {
      score: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      easyCorrect: { type: Number, default: 0 },
      easyIncorrect: { type: Number, default: 0 },
      mediumCorrect: { type: Number, default: 0 },
      mediumIncorrect: { type: Number, default: 0 },
      hardCorrect: { type: Number, default: 0 },
      hardIncorrect: { type: Number, default: 0 },
<<<<<<< HEAD
      maxScore: { type: Number, required: true }
=======
      questionsAsked: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 },
      },
>>>>>>> e5dd2ba35305ffd9782cea154391c3b5ae847a35
    },
  ],
});

<<<<<<< HEAD
export default mongoose.models.NewResults || mongoose.model('NewResults', ResultSchema);
=======
export default mongoose.models.Results || mongoose.model('Results', ResultSchema);
>>>>>>> e5dd2ba35305ffd9782cea154391c3b5ae847a35
