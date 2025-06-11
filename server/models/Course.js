import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const courseSchema = new Schema(
  {
    teacher: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "Développement web",
        "Développement mobile",
        "Machine Learning",
        "Data Science",
        "Cybersécurité",
        "Automatisation",
        "Autre",
      ],
      default: "Autre",
      required: true,
      index: true,
    },

    level: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Avancé"],
      default: "Débutant",
      required: true,
    },

    thumbnail: {
      type: String,
    },

    duration: {
      type: String,
      enum: [
        "Courte (moins de 1 mois)",
        "Moyenne (1 à 3 mois)",
        "Longue (3 mois et plus)",
      ],
      default: "Moyenne (1 à 3 mois)",
      required: true,
    },

    lessons: [
      {
        type: Types.ObjectId,
        ref: "Lesson",
      },
    ],

    quizFinal: {
      type: Types.ObjectId,
      ref: "Quiz",
    },

    enrolledStudents: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
