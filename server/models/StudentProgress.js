import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    lesson: {
      type: Number,
      default: 1,
    },
    completionStatus: {
      type: String,
      enum: ["in-progress", "completed", "failed"],
      default: "in-progress",
    },
    lessonsEnhanced: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Lesson",
      },
    ],
  },
  { timestamps: true }
);

studentSchema.index({ course: 1, student: 1 }, { unique: true });

const StudentProgress = mongoose.model("StudentProgress", studentSchema);
export default StudentProgress;
