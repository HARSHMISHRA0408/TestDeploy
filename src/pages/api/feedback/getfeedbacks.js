// pages/api/questions/getQuestions.js
import dbConnect from '../../../utils/db';
import Feedback from '../../../models/Feedback';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const questions = await Feedback.find({});
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ success: false, message: 'Failed to fetch questions.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

