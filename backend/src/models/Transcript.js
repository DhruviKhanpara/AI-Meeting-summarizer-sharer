import mongoose from "mongoose";

const TranscriptSchema = new mongoose.Schema({
  filePath: { type: String, required: true },
  originalName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transcript", TranscriptSchema);