import dbConnect from '../../utils/db';
import User from '../../models/UsersModel';
import bcrypt from 'bcryptjs'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For generating Web Tokens

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, password, knowledgeArea, category, role } = req.body;

    // Check for missing required fields
    if (!name || !email || !password || !knowledgeArea || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with a salt factor of 10

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      knowledgeArea,
      category,
      role: 'employee', // Default is 'employee' if not provided
    });

    await newUser.save();

    // Generate a JWT token
    const token =  jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role , knowledgeArea: newUser.knowledgeArea , category:newUser.category, test: newUser.test},
      process.env.JWT_SECRET, // Use a secret key from your environment variables
      { expiresIn: '1h' } // Token expiration time (adjust as needed)
    );

    await res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        knowledgeArea: newUser.knowledgeArea,
        category: newUser.category,
        role: newUser.role,
      },
      token, // Return the JWT token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
}
