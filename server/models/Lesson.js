import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    link: {
      type: String,
    },

    pdf: {
      type: String,
    },

    format: {
      type: String,
      enum: ["video", "pdf"],
      default: "video",
      required: true,
    },

    order: {
      type: Number,
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
