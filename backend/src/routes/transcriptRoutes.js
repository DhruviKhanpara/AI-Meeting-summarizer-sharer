import express from "express";
import upload from "../middleware/upload.js";
import { uploadManual, uploadFile } from "../controllers/transcriptController.js";

const router = express.Router();

router.post("/file", upload.single("file"), uploadFile);
router.post("/manual", uploadManual);


export default router;