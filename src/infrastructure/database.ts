import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    console.log("Database connected");
  } catch (err) {
    throw err;
  }
}
