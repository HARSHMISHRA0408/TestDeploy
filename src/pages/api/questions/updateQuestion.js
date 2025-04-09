// /pages/api/questions/updateQuestion.js
import dbConnect from '../../../utils/db';
import Question from '../../../models/Question';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Extract ID from the URL
      const { question, options, correct_option, knowledge_area, category, difficulty } = req.body;

      const updatedQuestion = await Question.findByIdAndUpdate(
        id, 
        { question, options, correct_option, knowledge_area, category, difficulty }, 
        { new: true }
      );

      res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update question.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
