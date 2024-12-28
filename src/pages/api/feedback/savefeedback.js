// pages/api/feedback/savefeedback.js
import dbConnect from '../../../utils/db';
import Feedback from '../../../models/Feedback';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, feedback } = req.body;

    if (!email || !feedback) {
      return res.status(400).json({ success: false, message: 'Email and feedback are required.' });
    }

    try {
      const newFeedback = new Feedback({ email, feedback });
      await newFeedback.save();

      res.status(200).json({ success: true, message: 'Feedback saved successfully.' });
    } catch (error) {
      console.error('Error saving feedback:', error);
      res.status(500).json({ success: false, message: 'Server error. Could not save feedback.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
