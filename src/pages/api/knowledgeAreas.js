import dbConnect from "../../utils/db";
import KnowledgeArea from "../../models/KnowledgeArea";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const knowledgeAreas = await KnowledgeArea.find({});
        res.status(200).json({ success: true, data: knowledgeAreas });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error fetching data" });
      }
      break;

    case "POST":
      try {
        const { name, categories } = req.body;
        // Ensure categories is an array of objects with a 'name' property
        const formattedCategories = categories.map((cat) => ({ name: cat }));
        const newKnowledgeArea = new KnowledgeArea({
          name,
          categories: formattedCategories,
        });
        await newKnowledgeArea.save();
        res.status(201).json({ success: true, data: newKnowledgeArea });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error creating knowledge area" });
      }
      break;

    case "PUT":
      try {
        const { id, name, categories } = req.body;
        const formattedCategories = categories.map((cat) => ({ name: cat }));
        const updatedKnowledgeArea = await KnowledgeArea.findByIdAndUpdate(
          id,
          { name, categories: formattedCategories },
          { new: true }
        );
        res.status(200).json({ success: true, data: updatedKnowledgeArea });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error updating knowledge area" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        await KnowledgeArea.findByIdAndDelete(id);
        res
          .status(200)
          .json({ success: true, message: "Knowledge area deleted" });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error deleting knowledge area" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
