import mongoose from "mongoose";

// Define the options schema
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true }, // Text of the option
});

// Define the main question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true }, // The question text
  options: [optionSchema], // An array of options
  correct_option: { type: String, required: true }, // The correct option text
  knowledge_area: { type: String, required: true }, // Knowledge area (e.g., Cloud Computing)
  category: { type: String, required: true }, // Category (e.g., Virtualization)
  difficulty: { type: String, required: true }, // Difficulty level (e.g., Hard)
});

// Create the model
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

module.exports = Question;


// according to given question model start quiz test with easy difficulty then if user answer correctly then increase difficulty to medium otherwise serve question for same difficulty level on first question and after that if dificulty level is medium and user answers correctly move difficulty to hard if wrong decrease difficulty level