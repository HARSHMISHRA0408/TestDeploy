import connectDb from "../../../utils/db";
import Otp from "../../../models/UsersModel";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });

  try {
    await connectDb();

    // Find OTP in DB
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) return res.status(400).json({ error: "Invalid OTP." });
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ error: "OTP expired." });
    }

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
