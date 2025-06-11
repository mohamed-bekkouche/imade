import express from "express";
import fs from "fs";
import path from "path";

const app = express();

// ...existing middleware...

// Add this after your other middleware
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Make sure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ...existing code...

export default app;
