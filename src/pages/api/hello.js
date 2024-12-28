import connectDB from "../../utils/db";

export default async function handler(req, res) {
  try {
    // Method validation
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    // Connect to the database
    await connectDB();

    res.status(200).json({ success: true, message: "Database connected successfully!" });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ success: false, error: "Database connection failed!" });
  }
}
