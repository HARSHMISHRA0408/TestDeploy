import dbConnect from '../../utils/db';
import Marks from '../../models/MarksModel';

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const marks = await Marks.find({});
        res.status(200).json({ success: true, data: marks });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching marks' });
      }
      break;

    case 'POST':
      try {
        const newMark = new Marks(req.body);
        await newMark.save();
        res.status(201).json({ success: true, data: newMark });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving mark' });
      }
      break;

    case 'PUT':
      try {
        const { id, ...updates } = req.body;
        const updatedMark = await Marks.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ success: true, data: updatedMark });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating mark' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
