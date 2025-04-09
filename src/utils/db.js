  import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log("Reusing existing database connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("MongoDB connected successfully.");
      return mongoose;
    }).catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      throw new Error("Failed to connect to MongoDB");
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
