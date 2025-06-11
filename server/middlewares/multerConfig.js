import multer from "multer";
import path from "path";
import fs from "fs";

// Use public/uploads directory and ensure it exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize the original filename
    // Replace spaces with underscores
    let sanitizedOriginalName = file.originalname.replace(/\s+/g, "_");
    // Keep only alphanumeric, dot, underscore, hyphen. Replace others with underscore.
    sanitizedOriginalName = sanitizedOriginalName.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );

    // Prevent excessively long filenames
    const ext = path.extname(sanitizedOriginalName);
    let baseName = path.basename(sanitizedOriginalName, ext);
    // Limit the base name part to avoid overly long filenames (e.g., > 200 chars for base)
    if (baseName.length > 200) {
      baseName = baseName.substring(0, 200);
    }
    const finalFilename = baseName + ext;

    // This path will be like 'uploads/sanitized_original_name.pdf'
    // It's what's typically stored in the database via controller logic.
    // Multer itself doesn't directly use file.path for saving, but controllers might use it.
    // The important part for saving is cb(null, finalFilename).
    file.path = path.join("uploads", finalFilename).replace(/\\/g, "/");

    // This is the actual name used to save the file on disk in the 'public/uploads' directory.
    cb(null, finalFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images (JPEG, PNG, GIF) and PDFs are allowed."
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
