import mongoose from "mongoose";

const EmailLogSchema = new mongoose.Schema({
  recipients: [{ type: String, required: true }],
  subject: { type: String },
  transcript: { type: String, required: true },
  prompt: { type: String },
  summary: { type: String, required: true },
  error: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("EmailLog", EmailLogSchema);