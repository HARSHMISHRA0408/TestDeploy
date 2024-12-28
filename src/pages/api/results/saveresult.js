// import dbConnect from '../../../utils/db';
// import Result from '../../../models/Result';

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === 'POST') {
//     const { email, score } = req.body;

//     // Validate email and score presence
//     if (!email || score == null) {
//       return res.status(400).json({ success: false, message: 'Email and score are required.' });
//     }

//     // Convert score to a number and validate
//     const numericScore = Number(score);
//     if (isNaN(numericScore)) {
//       return res.status(400).json({ success: false, message: 'Score must be a number.' });
//     }

//     try {
//       // Check if a result exists for the email
//       let result = await Result.findOne({ email });

//       if (result) {
//         // Update existing result with the new score and attempt
//         result.scores = numericScore;
//         result.attempts = { score: numericScore, date: new Date() };
//       } else {
//         // Create a new result document
//         result = new Result({
//           email,
//           scores: numericScore,
//           attempts: { score: numericScore, date: new Date() },
//         });
//       }

//       // Save the document
//       await result.save();
//       res.status(200).json({ success: true, message: 'Result saved successfully.' });
//     } catch (error) {
//       console.error('Error saving result:', error);
//       res.status(500).json({ success: false, message: 'Server error. Could not save result.' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import dbConnect from '../../../utils/db';
import Result from '../../../models/Result';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, score } = req.body;

    // Basic validation
    if (!email || score == null) {
      return res.status(400).json({ success: false, message: 'Email and score are required.' });
    }

    const numericScore = Number(score);
    if (isNaN(numericScore)) {
      return res.status(400).json({ success: false, message: 'Score must be a number.' });
    }

    try {
      // Find or create a result document
      let result = await Result.findOne({ email });

      if (result) {
        // Append new score and attempt
        result.scores.push(numericScore);
        result.attempts.push({ score: numericScore, date: new Date() });
      } else {
        // Create a new result if it doesn't exist
        result = new Result({
          email,
          scores: [numericScore],
          attempts: [{ score: numericScore, date: new Date() }],
        });
      }

      // Save changes to the database
      await result.save();
      return res.status(200).json({ success: true, message: 'Result saved successfully.' });
    } catch (error) {
      console.error('Error saving result:', error);
      return res.status(500).json({ success: false, message: 'Server error. Could not save result.' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
  }
}
