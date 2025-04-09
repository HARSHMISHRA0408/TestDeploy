import dbConnect from '../../../utils/db';
import Question from '../../../models/Question';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        const question = await Question.findById(id);
        if (!question) {
          return res.status(404).json({ success: false, message: 'Question not found.' });
        }
        return res.status(200).json({ success: true, data: question });
      }

      // If no id, return all questions
      const questions = await Question.find({});
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ success: false, message: 'Failed to fetch questions.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
