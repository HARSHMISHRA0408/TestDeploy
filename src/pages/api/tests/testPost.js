import connectDB from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === "POST") {
    const { userId, testName, category, knowledgeArea } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.tests.push({ name: testName, category, knowledgeArea, permission: "allowed" });
      await user.save();

      res.status(201).json({ message: "Test added successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error adding test" });
    }
  }
}
