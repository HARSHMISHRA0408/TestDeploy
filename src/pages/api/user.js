import dbConnect from "../../utils/db";
import User from "../../models/UsersModel";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error fetching users" });
      }
      break;

    case "PUT":
      try {
        const { id, ...updates } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, updates, {
          new: true,
        });
        res.status(200).json({ success: true, data: updatedUser });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Error updating user" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  // dbConnect.close();
}
