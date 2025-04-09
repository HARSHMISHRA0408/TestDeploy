// models/knowledgeAreaSchema.js
import mongoose from "mongoose";

// Define the category schema (simple array of strings for categories)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Define the knowledge area schema
const knowledgeAreaSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the knowledge area
  categories: [categorySchema], // Array of categories under the knowledge area
});

// Create the model
const KnowledgeArea =
  mongoose.models.KnowledgeArea ||
  mongoose.model("KnowledgeArea", knowledgeAreaSchema);

module.exports = KnowledgeArea;
