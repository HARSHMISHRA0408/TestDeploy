import dbConnect from "../../utils/db";
import User from "../../models/UsersModel";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { email, test } = req.body;

    // Validate the request body
    if (!email || !test) {
      return res.status(400).json({ success: false, message: "Missing email or test field" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update only the test field
    user.test = test;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Test status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating test status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

