import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { api } from "../api/api";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import authService from "../services/authService";

// Add request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const SignupQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user data from auth store
  const { user, hasCompletedQuiz, setQuizCompleted } = useAuthStore();

  // Redirect if quiz is completed or user is not a student
  useEffect(() => {
    console.log("USer. : ", user);
    if (!user) {
      navigate("/login");
      return;
    }

    if (user?.role !== "student") {
      navigate("/");
      return;
    }

    if (hasCompletedQuiz()) {
      console.log("Quiz already completed, redirecting...");
      navigate("/dashboard");
      return;
    }
  }, [user, hasCompletedQuiz, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    ageGroup: "",
    educationLevel: "",
    programmingExperience: "",
    favoriteProgrammingTopic: "",
    learningStyle: "",
    weeklyAvailability: "",
    preferredCourseDuration: "",
    learningAutonomy: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Submit to recommendation form endpoint
      await authService.recommendationForm(formData);
      setQuizCompleted(true);
      setSuccess("Profil d'apprentissage enregistré avec succès!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.log("Error : ", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Une erreur est survenue lors de l'enregistrement du profil. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary">
        Profil d'Apprentissage Adaptatif
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Ces informations nous aideront à personnaliser votre expérience
        d'apprentissage.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <FormControl fullWidth margin="normal">
            <FormLabel>Groupe d'âge</FormLabel>
            <RadioGroup
              value={formData.ageGroup}
              onChange={(e) => handleInputChange("ageGroup", e.target.value)}
            >
              {["18–24 ans", "25–34 ans", "35–44 ans", "45+ ans"].map(
                (option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                )
              )}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Niveau d'éducation</FormLabel>
            <RadioGroup
              value={formData.educationLevel}
              onChange={(e) =>
                handleInputChange("educationLevel", e.target.value)
              }
            >
              {[
                "Lycée",
                "Bac",
                "Universitaire (Bac +2, +3, +5 ou plus)",
                "Formation professionnelle",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Expérience en programmation</FormLabel>
            <RadioGroup
              value={formData.programmingExperience}
              onChange={(e) =>
                handleInputChange("programmingExperience", e.target.value)
              }
            >
              {["Débutant", "Intermédiaire", "Avancé"].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Sujet de programmation préféré</FormLabel>
            <RadioGroup
              value={formData.favoriteProgrammingTopic}
              onChange={(e) =>
                handleInputChange("favoriteProgrammingTopic", e.target.value)
              }
            >
              {[
                "Data Science",
                "Machine Learning",
                "Développement mobile",
                "Développement web",
                "Cybersécurité",
                "Automatisation",
                "Automatisation / Scripts",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Style d'apprentissage préféré</FormLabel>
            <RadioGroup
              value={formData.learningStyle}
              onChange={(e) =>
                handleInputChange("learningStyle", e.target.value)
              }
            >
              {[
                "Visuel (vidéos, schémas explicatifs)",
                "Kinesthésique (exercices pratiques)",
                "Lecture / Écriture (cours écrits, tutoriels PDF, articles)",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Disponibilité hebdomadaire</FormLabel>
            <RadioGroup
              value={formData.weeklyAvailability}
              onChange={(e) =>
                handleInputChange("weeklyAvailability", e.target.value)
              }
            >
              {[
                "Moins de 2 heures",
                "2 à 5 heures",
                "5 à 10 heures",
                "Plus de 10 heures",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Durée de cours préférée</FormLabel>
            <RadioGroup
              value={formData.preferredCourseDuration}
              onChange={(e) =>
                handleInputChange("preferredCourseDuration", e.target.value)
              }
            >
              {[
                "Courte (moins de 1 mois)",
                "Moyenne (1 à 3 mois)",
                "Longue (3 mois et plus)",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Autonomie d'apprentissage</FormLabel>
            <RadioGroup
              value={formData.learningAutonomy}
              onChange={(e) =>
                handleInputChange("learningAutonomy", e.target.value)
              }
            >
              {[
                "Faible (besoin d'accompagnement important)",
                "Moyenne",
                "Élevée (je préfère apprendre seul)",
                "Je préfère apprendre de manière autonome",
              ].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={24} /> : <Check />}
          >
            {loading ? "Enregistrement..." : "Terminer"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default SignupQuiz;
