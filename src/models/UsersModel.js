import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Set a minimum password length
  },
  knowledgeArea: {
    type: String,
    required: true, // Assuming this refers to a specific area of knowledge
  },
  category: {
    type: String,
    required: true, // Refers to a category in the context of the user's knowledge area
  },
  role: {
    type: String,
    enum: ['employee', 'admin' , 'manager'], // Restrict to predefined roles
    default: 'employee', // Set default role as 'employee'
  },
  registrationDate: {
    type: Date,
    default: Date.now, // Automatically sets the registration date
  },
  test: {
    type: String,
    enum: ['allowed', 'pending', 'notallowed','rejected'], // Restrict to predefined statuses
    default: 'allowed', // Set default status as 'allowed'
},
});

// Create the user model or use an existing one
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
