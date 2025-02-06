// // /api/user/update.js
// //used in Quiz section on submit to change allow to not allow

// import dbConnect from "../../utils/db";  // Database connection helper
// import User from "../../models/UsersModel"; // Assuming the User model is located in /models/User.js


// export default async function handler(req, res) {
//   if (req.method === "PATCH") {
//     // Authenticate the user first
//     try {
//       await dbConnect();  // Connect to the database

//       const { email, name, knowledgeArea, category, role, test } = req.body;

//       // Check if the logged-in user is trying to update their own information
//       if (req.user.email !== email) {
//         return res.status(403).json({ success: false, message: "You can only update your own details" });
//       }

//       // Find the user by email and update the details
//       const user = await User.findOne({ email: req.user.email });
//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }

//       // Update user details
//       user.name = name || user.name;
//       user.knowledgeArea = knowledgeArea || user.knowledgeArea;
//       user.category = category || user.category;
//       user.role = role || user.role;
//       user.test = test;

//       await user.save(); // Save updated user data

//       res.status(200).json({ success: true, message: "User details updated successfully" });
//     } catch (error) {
//       console.error("Error updating user:", error);
//       res.status(500).json({ success: false, message: "Internal server error" });
//     }

//   } else {
//     res.status(405).json({ success: false, message: "Method Not Allowed" });
//   }
// }

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

