// import mongoose from "mongoose";

// // Define the user schema
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // Ensure email is unique
//     trim: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6, // Set a minimum password length
//   },
//   knowledgeArea: {
//     type: String,
//     required: true, // Assuming this refers to a specific area of knowledge
//   },
//   category: {
//     type: String,
//     required: true, // Refers to a category in the context of the user's knowledge area
//   },
//   role: {
//     type: String,
//     enum: ['employee', 'admin' , 'manager'], // Restrict to predefined roles
//     default: 'employee', // Set default role as 'employee'
//   },
//   registrationDate: {
//     type: Date,
//     default: Date.now, // Automatically sets the registration date
//   },
//   test: {
//     type: String,
//     enum: ['allowed', 'pending', 'notallowed','rejected'], // Restrict to predefined statuses
//     default: 'allowed', // Set default status as 'allowed'
// },
// });

// // Create the user model or use an existing one
// const User = mongoose.models.User || mongoose.model('User', userSchema);

// module.exports = User;


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
  knowledgeArea: {
    type: String,
    required: false, // Set to optional if not always applicable
    default: "employee",
  },
  category: {
    type: String,
    required: false, // Set to optional if not always applicable
    default: "employee",
  },
  role: {
    type: String,
    enum: ["employee", "admin", "manager", "guest"], // Added 'guest' role for unregistered or trial users
    default: "employee", // Default role is 'employee'
  },
  test: {
    type: String,
    enum: ["allowed", "pending", "notallowed", "rejected"], // Restrict to predefined statuses
    default: "allowed", // Default status is 'allowed'
  },
  profileImage: {
    type: String,
    required: false, // Optional field for storing profile image URL
  },
  registrationDate: {
    type: Date,
    default: Date.now, // Automatically sets the registration date
  },
  manageKnowledgeArea: {
    type: [String], // Allow user to manage multiple knowledge areas
    default: [], // Default to false
    required: false, // Optional field
  },


});

// Add an index on email for faster queries
//userSchema.index({ email: 1 });


// Create the user model or use an existing one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
