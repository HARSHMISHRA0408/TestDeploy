// // models/Result.js
// import mongoose from 'mongoose';

// const ResultSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   scores:
//     {
//       type: Number, // each entry in scores array should be a number
//       required: true,
//     },
//   attempts:
//     {
//       score: { type: Number, required: true },
//       date: { type: Date, default: Date.now },
//     },
// });

// export default mongoose.models.Score || mongoose.model('Score', ResultSchema);

import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
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
    },
  ],
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
