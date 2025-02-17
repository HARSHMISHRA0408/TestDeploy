import connectDB from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "PUT") {
    const { userId, testId, permission } = req.body;  

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const test = user.tests.id(testId);
      if (!test) return res.status(404).json({ message: "Test not found" });

      if (permission !== undefined) {  
        test.permission = permission;  
      }

      await user.save();

      res.status(200).json({ message: "Test updated successfully", test });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating test" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
