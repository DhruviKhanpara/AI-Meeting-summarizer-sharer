import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".txt" || ext === ".docx") {
    cb(null, true);
  } else {
    cb(new Error("Only .txt and .docx files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
