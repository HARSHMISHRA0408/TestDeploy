import dbConnect from "../../../utils/db";
import User from "../../../models/UsersModel";

export default async function handler(req, res) {
  await dbConnect();

  const { userId, knowledgeArea } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (req.method === "POST") {
      // Add knowledge area if not already present
      if (!user.manageKnowledgeArea.includes(knowledgeArea)) {
        user.manageKnowledgeArea.push(knowledgeArea);
        await user.save();
      }
      return res.status(200).json({ success: true, message: "Knowledge area added", user });
    } 
    
    else if (req.method === "DELETE") {
      // Remove knowledge area
      user.manageKnowledgeArea = user.manageKnowledgeArea.filter(area => area !== knowledgeArea);
      await user.save();
      return res.status(200).json({ success: true, message: "Knowledge area removed", user });
    } 
    
    else {
      return res.status(405).json({ success: false, message: "Method not allowed." });
    }
  } catch (error) {
    console.error("Error managing knowledge area:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
}
