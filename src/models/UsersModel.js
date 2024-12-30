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
  password: {
    type: String,
    required: true,
    minlength: 6, // Set a minimum password length
  },
  knowledgeArea: {
    type: String,
    required: false, // Set to optional if not always applicable
  },
  category: {
    type: String,
    required: false, // Set to optional if not always applicable
  },
  role: {
    type: String,
    enum: ["employee", "admin", "manager", "guest"], // Added 'guest' role for unregistered or trial users
    default: "employee", // Default role is 'employee'
  },
  testStatus: {
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
  lastLogin: {
    type: Date,
    default: null, // Optional field for storing the last login timestamp
  },
  isActive: {
    type: Boolean,
    default: true, // Indicates if the user account is active
  },
  resetPasswordToken: {
    type: String,
    default: null, // Token used for resetting password
  },
  resetPasswordExpires: {
    type: Date,
    default: null, // Expiration date for the reset token
  },
  otp: {
    type: String,
    default: null, // OTP for email verification or password reset
  },
  otpExpires: {
    type: Date,
    default: null, // Expiration date for the OTP
  },
  notifications: {
    type: [String], // Array of notification messages or IDs
    default: [], // Default to empty array
  },
  preferences: {
    type: Object, // Object to store user preferences (e.g., theme, language)
    default: {}, // Default to an empty object
  },
});

// Add an index on email for faster queries
userSchema.index({ email: 1 });

// Add a pre-save hook for hashing passwords if needed (example with bcrypt)
/*
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
*/

// Create the user model or use an existing one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
