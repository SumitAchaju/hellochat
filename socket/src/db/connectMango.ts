import mongoose from "mongoose";

const dynamicSchema = new mongoose.Schema({}, { strict: false });
const DynamicModel = mongoose.model("DynamicCollection", dynamicSchema);

export default async function connectMangoDb() {
  const MANGO_URL = process.env.MANGO_URL;
  if (!MANGO_URL) {
    throw Error("Mango URL is not provided");
  }
  return await mongoose.connect(MANGO_URL);
}

export { DynamicModel };
