import dbConnect from "../../../utils/db";
import Question from "../../../models/Question";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  if (method === "OPTIONS") {
    return res.status(200).end(); // Preflight
  }

  if (method === "GET") {
    try {
      // Group by knowledge_area and category, count documents
      const counts = await Question.aggregate([
        {
          $group: {
            _id: {
              knowledge_area: "$knowledge_area",
              category: "$category",
              difficulty: "$difficulty"
            },
            totalQuestions: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.knowledge_area": 1,
            "_id.category": 1,
          },
        },
      ]);

      // Format output for clarity
      const formatted = counts.map((item) => ({
        knowledge_area: item._id.knowledge_area,
        category: item._id.category,
        difficulty: item._id.difficulty,
        totalQuestions: item.totalQuestions,
      }));

      return res.status(200).json({
        success: true,
        data: formatted,
      });

    } catch (error) {
      console.error("Error fetching question counts:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch question counts.",
        error: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
