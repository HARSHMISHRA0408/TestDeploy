import User from "../../models/UsersModel"; // Assuming you have a User model

// POST request to approve/reject user request
const handleUserAction = async (req, res) => {
  const { email, action } = req.body; // Get email and action ('allowed' or 'rejected')

  if (!email || !action || !["allowed", "rejected"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data. Provide valid email and action.",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user already has a test status other than 'pending'
    if (user.test !== "pending") {
      return res.status(400).json({
        success: false,
        message: "User's test status is not pending.",
      });
    }

    // Update the user's test status based on action
    user.test = action; // Update the test field to either 'allowed' or 'rejected'
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User's test status has been updated to '${action}'.`,
    });
  } catch (error) {
    console.error("Error updating user test status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default handleUserAction;
