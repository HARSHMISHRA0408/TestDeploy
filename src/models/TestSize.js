import mongoose from "mongoose";

const testSizeSchema = new mongoose.Schema({
  size: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    default: 0,
  },
});

// Ensure the model is not recompiled on hot reloads
const TestSize = mongoose.models.TestSize || mongoose.model("TestSize", testSizeSchema);

export default TestSize;
