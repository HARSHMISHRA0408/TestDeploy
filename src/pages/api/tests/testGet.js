import connectDB from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
    await connectDB();
  
    if (req.method === "GET") {
      const { userId } = req.query;
  
      try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
  
        res.status(200).json({ tests: user.tests });
      } catch (error) {
        res.status(500).json({ message: "Error fetching tests" });
      }
    }
  }
  
