import dbConnect from '../../../utils/db';
import Question from '../../../models/Question';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  const { method, query } = req;

  if (method === 'OPTIONS') {
    return res.status(200).end(); // Preflight
  }

  if (method === 'GET') {
    const { id } = query;

    try {
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: 'Invalid question ID format.' });
        }

        const question = await Question.findById(id).lean();
        if (!question) {
          return res.status(404).json({ success: false, message: 'Question not found.' });
        }

        return res.status(200).json({ success: true, data: question });
      }

      const questions = await Question.find({}).lean();
      return res.status(200).json({ success: true, data: questions });

    } catch (error) {
      console.error("Error fetching questions:", error);
      return res.status(500).json({ success: false, message: 'Failed to fetch questions.', error: error.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
