import connectDB from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
    await connectDB();
  
    if (req.method === "DELETE") {
      const { userId, testId } = req.body;
  
      try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
  
        user.tests = user.tests.filter((test) => test._id.toString() !== testId);
        await user.save();
  
        res.status(200).json({ message: "Test deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting test" });
      }
    }
  }
  
