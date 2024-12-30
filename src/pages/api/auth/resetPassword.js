import connectDb from "../../../utils/db";
import User from "../../../models/UsersModel";
import Otp from "../../../models/Otp";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password, otp } = req.body;

  if (!email || !password || !otp) return res.status(400).json({ error: "All fields are required." });

  try {
    await connectDb();

    // Validate OTP
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) return res.status(400).json({ error: "Invalid OTP." });
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: "OTP expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await User.updateOne({ email }, { password: hashedPassword });

    // Remove OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
