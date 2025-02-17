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
//   knowledgeArea: {
//     type: String,
//     required: false, // Set to optional if not always applicable
//     default: "employee",
//   },
//   category: {
//     type: String,
//     required: false, // Set to optional if not always applicable
//     default: "employee",
//   },
//   role: {
//     type: String,
//     enum: ["employee", "admin", "manager", "guest"], // Added 'guest' role for unregistered or trial users
//     default: "employee", // Default role is 'employee'
//   },
//   test: {
//     type: String,
//     enum: ["allowed", "pending", "notallowed", "rejected"], // Restrict to predefined statuses
//     default: "allowed", // Default status is 'allowed'
//   },
//   profileImage: {
//     type: String,
//     required: false, // Optional field for storing profile image URL
    
//   },
//   registrationDate: {
//     type: Date,
//     default: Date.now, // Automatically sets the registration date
//   },
//   manageKnowledgeArea: {
//     type: [String], // Allow user to manage multiple knowledge areas
//     default: [], // Default to false
//     required: false, // Optional field
//   },


// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;


import mongoose from "mongoose";



const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  knowledgeArea: { type: String, required: true },
  permission: {
    type: String,
    enum: ["allowed", "pending", "notallowed", "rejected"],
    default: "allowed",
  },
});

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

  tests: [testSchema], // Store multiple tests per user
  // tests: {
  //   test1: {
  //     knowledgeArea: { type: String, required: true },
  //     category: { type: String, required: true },
  //     permission: {
  //       type: String,
  //       enum: ["allowed", "pending", "notallowed", "rejected"], // Restrict to predefined statuses
  //       default: "notallowed", // Default is 'notallowed' (requires approval)
  //     },
  //   },
  //   test2: {
  //     knowledgeArea: { type: String, required: true },
  //     category: { type: String, required: true },
  //     permission: {
  //       type: String,
  //       enum: ["allowed", "pending", "notallowed", "rejected"],
  //       default: "notallowed",
  //     },
  //   },
  //   test3: {
  //     knowledgeArea: { type: String, required: true },
  //     category: { type: String, required: true },
  //     permission: {
  //       type: String,
  //       enum: ["allowed", "pending", "notallowed", "rejected"],
  //       default: "notallowed",
  //     },
  //   },
  //   test4: {
  //     knowledgeArea: { type: String, required: true },
  //     category: { type: String, required: true },
  //     permission: {
  //       type: String,
  //       enum: ["allowed", "pending", "notallowed", "rejected"],
  //       default: "notallowed",
  //     },
  //   },
  // },
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
    default: [], // Default to empty array
    required: false, // Optional field
  },
});

const User = mongoose.models.Usermtest || mongoose.model("Usermtest", userSchema);

export default User;
