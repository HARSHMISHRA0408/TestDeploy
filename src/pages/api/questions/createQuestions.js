import dbConnect from '../../../utils/db'; // Import the database connection
import Question from '../../../models/Question'; // Import the question model

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { question, options, correct_option, knowledge_area, category, difficulty } = req.body;

      // Create a new question object
      const newQuestion = new Question({
        question,
        options,
        correct_option,
        knowledge_area,
        category,
        difficulty,
      });

      // Save the question to the database
      await newQuestion.save();

      res.status(201).json({ success: true, message: 'Question saved successfully!' });
    } catch (error) {
      console.error("Error saving question:", error);
      res.status(500).json({ success: false, message: 'Failed to save the question.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
