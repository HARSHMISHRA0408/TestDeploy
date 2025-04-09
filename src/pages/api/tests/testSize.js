import connectDB from "../../../utils/db";
import TestSize from "../../../models/TestSize"; // Ensure correct import

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "PUT") {
    const { id, size } = req.body; // Get test size ID and new size value

    try {
      if (!id || !size) {
        return res.status(400).json({ message: "ID and new size are required" });
      }

      const updatedTestSize = await TestSize.findByIdAndUpdate(
        id,
        { size },
        { new: true } // Return the updated document
      );

      if (!updatedTestSize) {
        return res.status(404).json({ success: false, message: "Test size not found" });
      }

      res.status(200).json({ success: true, message: "Test size updated successfully", testSize: updatedTestSize });
    } catch (error) {
      console.error("Error updating test size:", error);
      res.status(500).json({ success: false, message: "Error updating test", error: error.message });
    }
  }

  else if (req.method === "GET") {
    // Handle GET request (Fetch all TestSizes)
    try {
      const testSizes = await TestSize.find();

      res.status(200).json({ success: true, testSizes });
    } catch (error) {
      console.error("Error fetching test sizes:", error);
      res.status(500).json({ success: false, message: "Error fetching test sizes", error: error.message });
    }
  }
  else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
