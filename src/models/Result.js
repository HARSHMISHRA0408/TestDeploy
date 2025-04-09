
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
      maxScore: { type: Number, required: true }
    },
  ],
});

export default mongoose.models.NewResults || mongoose.model('NewResults', ResultSchema);
