import mongoose from "mongoose";

const markSchema = mongoose.Schema({
  level: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Number,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});


// Create the user model or use an existing one
const Marks = mongoose.models.Marks || mongoose.model('Marks', markSchema);

module.exports = Marks;