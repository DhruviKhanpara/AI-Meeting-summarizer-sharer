import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema({
  transcript: { type: String, required: true },
  prompt: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Summary", SummarySchema);