import dbConnect from "../../../utils/db"; // Import your DB connection utility
import User from "../../../models/UsersModel"; // Import your Mongoose User model

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect(); // Ensure database connection

    const { userIds, testName, category, knowledgeArea } = req.body;

    if (!userIds || userIds.length === 0 || !testName || !category || !knowledgeArea) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create test object
    const newTest = {
      name: testName,
      category,
      knowledgeArea,
      createdAt: new Date(),
    };

    // Add the test to multiple users
    await User.updateMany(
      { _id: { $in: userIds } },
      { $push: { tests: newTest } } // Push test to each user's tests array
    );

    return res.status(201).json({ message: "Test assigned to users", test: newTest });
  } catch (error) {
    console.error("Error assigning test:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
