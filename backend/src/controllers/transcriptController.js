import fs from "fs";
import path from "path";
import Transcript from "../models/Transcript.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const transcript = new Transcript({
      filePath: req.file.path,
      originalName: req.file.originalname,
    });

    await transcript.save();
    res.json({ message: "Transcript uploaded successfully", transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading transcript" });
  }
};

export const uploadManual = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ message: "Transcript content required" });
    }

    const fileName = `${Date.now()}-manual.txt`;
    const filePath = path.join(process.cwd(), "src/uploads", fileName);

    fs.writeFileSync(filePath, transcript, "utf8");

    const transcriptDoc = new Transcript({
      filePath,
      originalName: fileName,
    });

    await transcriptDoc.save();
    res.json({ message: "Manual transcript saved", transcript: transcriptDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving transcript" });
  }
};