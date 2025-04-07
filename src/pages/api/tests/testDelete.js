// import connectDB from "../../../utils/db";
// import User from "../../../models/UsersModel";

// export default async function handler(req, res) {
//     await connectDB();
  
//     if (req.method === "DELETE") {
//       const { userId, testId} = req.body;
  
//       try {
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: "User not found" });
  
//         user.tests = user.tests.filter((test) => test._id.toString() !== testId);
//         await user.save();
  
//         res.status(200).json({ message: "Test deleted successfully" });
//       } catch (error) {
//         res.status(500).json({ message: "Error deleting test" });
//       }
//     }
//   }
  
import connectDB from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "DELETE") {
    try {
      const { userId, testId } = req.body;

      // Validate input
      if (!userId || !testId) {
        return res.status(400).json({ message: "userId and testId are required" });
      }

      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove the test from the `tests` array
      const initialLength = user.tests.length;
      user.tests = user.tests.filter((test) => !test._id.equals(testId));

      // If no test was removed, return an error
      if (user.tests.length === initialLength) {
        return res.status(404).json({ message: "Test not found in user data" });
      }

      await user.save();

      res.status(200).json({ message: "Test deleted successfully", updatedTests: user.tests });
    } catch (error) {
      console.error("Error deleting test:", error);
      res.status(500).json({ message: "Error deleting test", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
