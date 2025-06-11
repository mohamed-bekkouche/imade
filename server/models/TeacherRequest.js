import mongoose from "mongoose";
const { Schema } = mongoose;

const teacherRequestSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "refused"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

teacherRequestSchema.index({ studentId: 1 });

const TeacherRequest = mongoose.model("TeacherRequest", teacherRequestSchema);
export default TeacherRequest;
