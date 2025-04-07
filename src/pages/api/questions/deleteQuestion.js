import ConnectDB from "../../../utils/db";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  await ConnectDB();

  if (req.method === "DELETE") {
    try {
      const { questionId } = req.body;

      // Validate questionId
      if (!questionId) {
        return res.status(400).json({ success: false, message: "Question ID is required" });
      }

      // Find the question by ID
      const question = await Question.findById(questionId);
      if (!question) {
        return res.status(404).json({ success: false, message: "Question not found" });
      }

      // Delete the question
      await Question.findByIdAndDelete(questionId);

      return res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });

    } catch (error) {
      console.error("Error deleting question:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
