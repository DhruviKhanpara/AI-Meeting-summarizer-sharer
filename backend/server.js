import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import summaryRoutes from "./src/routes/summaryRoutes.js";
import emailRoutes from "./src/routes/emailRoutes.js";
import transcriptRoutes from "./src/routes/transcriptRoutes.js";

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Serve React frontend
// Serve React frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Your API routes
app.get('/api/helthCheck', (req, res) => {
  res.json({ message: 'Backend API working!' });
});
app.use("/api/summary", summaryRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/transcripts", transcriptRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
