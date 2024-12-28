import dbConnect from "../../../utils/db";
import result from "../../../models/Result";

export default async function hadler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const Result = await result.find({});
      res.status(200).json({ success: true, data: Result });
    } catch (error) {
      console.error("Error fetching questions:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch questions." });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
