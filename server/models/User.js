import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    gender: {
      type: String,
      enum: ["Homme", "Femme"],
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    avatar: { type: String, default: "/uploads/user.jpeg" },

    myCourses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],

    ageGroup: {
      type: String,
      enum: [
        "Moins de 18 ans",
        "18–24 ans",
        "25–34 ans",
        "35–44 ans",
        "45 ans et plus",
      ],
    },
    educationLevel: {
      type: String,
      enum: [
        "Aucun diplôme",
        "Collège / Lycée",
        "Bac",
        "Universitaire (Bac +2, +3, +5 ou plus)",
      ],
    },
    programmingExperience: {
      type: String,
      enum: ["Débutant", "Intermédiaire", "Avancé"],
    },
    favoriteProgrammingTopic: {
      type: String,
      enum: [
        "Data Science",
        "Machine Learning",
        "Développement mobile",
        "Développement web",
        "Cybersécurité",
        "Automatisation",
        "Automatisation / Scripts",
      ],
    },
    learningStyle: {
      type: String,
      enum: [
        "Visuel (vidéos, schémas explicatifs)",
        "Kinesthésique (exercices pratiques)",
        "Lecture / Écriture (cours écrits, tutoriels PDF, articles)",
      ],
    },
    weeklyAvailability: {
      type: String,
      enum: [
        "Moins de 2 heures",
        "2 à 5 heures",
        "5 à 10 heures",
        "Plus de 10 heures",
      ],
    },
    preferredCourseDuration: {
      type: String,
      enum: [
        "Courte (moins de 1 mois)",
        "Moyenne (1 à 3 mois)",
        "Longue (3 mois et plus)",
      ],
    },
    learningAutonomy: {
      type: String,
      enum: [
        "Faible (besoin d'accompagnement important)",
        "Moyenne",
        "Élevée (je préfère apprendre seul)",
        "Je préfère apprendre de manière autonome",
      ],
    },
    hasCompletedSignupQuiz: {
      type: Boolean,
      default: false,
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });

const User = model("User", userSchema);
export default User;
