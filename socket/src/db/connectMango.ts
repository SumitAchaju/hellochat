import mongoose from "mongoose";

export default async function connectMangoDb() {
  const MANGO_URL = process.env.MANGO_URL;
  if (!MANGO_URL) {
    throw Error("Mango URL is not provided");
  }
  return await mongoose.connect(MANGO_URL);
}
