import { model } from "mongoose";
export async function getTotalDocument(modelName: string) {
  const modelData = model(modelName);
  return await modelData.countDocuments();
}
