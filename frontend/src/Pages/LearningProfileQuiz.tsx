import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { FaArrowLeft, FaArrowRight, FaCheck, FaSpinner } from "react-icons/fa";

interface Question {
  id: string;
  text: string;
  type: "single" | "multiple" | "text";
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const LearningProfileQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const sections: Section[] = [
    {
      id: "section1",
      title: "Ta façon de comprendre",
      description:
        "Ces questions nous aident à comprendre comment tu assimiles l'information.",
      questions: [
        {
          id: "format",
          text: "1.1 - Quels formats t'aident à mieux comprendre ?",
          type: "multiple",
          options: [
            { value: "videos", label: "Vidéos explicatives" },
            { value: "images", label: "Images / schémas" },
            { value: "text", label: "Texte écrit structuré" },
            { value: "audio", label: "Podcasts ou explications audio" },
            { value: "practice", label: "Exercices pratiques" },
            { value: "games", label: "Jeux interactifs" },
            { value: "cases", label: "Études de cas ou mises en situation" },
          ],
          required: true,
        },
        {
          id: "contentStyle",
          text: "1.2 - Quel style de contenu préfères-tu ?",
          type: "single",
          options: [
            { value: "simple", label: "Des explications simples et courtes" },
            {
              value: "detailed",
              label: "Des explications détaillées et approfondies",
            },
            { value: "mixed", label: "Un mélange des deux, selon les sujets" },
          ],
          required: true,
        },
        {
          id: "lessonDuration",
          text: "1.3 - Quelle durée de leçon préfères-tu ?",
          type: "single",
          options: [
            { value: "veryShort", label: "Très courte (moins de 1 heure)" },
            { value: "short", label: "Courte (5 à 10 heures)" },
            { value: "medium", label: "Moyenne (10 à 20 heures)" },
            { value: "long", label: "Longue (plus de 20 heures)" },
          ],
          required: true,
        },
        {
          id: "imagesHelp",
          text: "1.4 - Est-ce que les images t'aident à mieux comprendre ?",
          type: "single",
          options: [
            { value: "veryMuch", label: "Oui, énormément" },
            { value: "aLittle", label: "Un peu" },
            { value: "notReally", label: "Pas vraiment" },
          ],
          required: true,
        },
        {
          id: "listenOrRead",
          text: "1.5 - Préfères-tu écouter ou lire pour comprendre ?",
          type: "single",
          options: [
            { value: "listen", label: "Écouter (audio / vidéo)" },
            { value: "read", label: "Lire (texte / support écrit)" },
            { value: "both", label: "Les deux" },
          ],
          required: true,
        },
        {
          id: "retentionMethod",
          text: "1.6 - Comment retiens-tu mieux une information ?",
          type: "single",
          options: [
            { value: "reading", label: "En lisant" },
            { value: "listening", label: "En écoutant" },
            { value: "practicing", label: "En pratiquant" },
            { value: "repeating", label: "En répétant ou expliquant" },
            {
              value: "visualizing",
              label: "En visualisant (schémas, dessins)",
            },
          ],
          required: true,
        },
      ],
    },
    {
      id: "section2",
      title: "Tes préférences d'apprentissage",
      description: "Aide-nous à comprendre comment tu préfères apprendre.",
      questions: [
        {
          id: "learningPace",
          text: "2.1 - Tu préfères apprendre :",
          type: "single",
          options: [
            { value: "ownPace", label: "À ton propre rythme" },
            {
              value: "withDeadlines",
              label: "Avec un calendrier et des deadlines",
            },
            { value: "withReminders", label: "Avec des rappels automatiques" },
            { value: "withGuidance", label: "En étant accompagné(e)" },
          ],
          required: true,
        },
        {
          id: "courseType",
          text: "2.2 - Tu préfères des cours :",
          type: "multiple",
          options: [
            { value: "theoretical", label: "Très théoriques" },
            { value: "practical", label: "Très pratiques" },
            { value: "balanced", label: "Un bon équilibre des deux" },
            { value: "short", label: "Courts" },
            { value: "long", label: "Longs" },
          ],
          required: true,
        },
        {
          id: "motivatingStyle",
          text: "2.3 - Quel style de cours te motive le plus ?",
          type: "single",
          options: [
            { value: "interactive", label: "Interactif avec quiz et feedback" },
            {
              value: "projectBased",
              label: "Basé sur des projets ou des cas réels",
            },
            { value: "gamified", label: "Gamifié (badges, niveaux, défis)" },
            {
              value: "structured",
              label: "Structuré comme un parcours classique",
            },
          ],
          required: true,
        },
      ],
    },
    {
      id: "section3",
      title: "Exercices, quiz & évaluation",
      description: "Aide-nous à comprendre comment tu préfères être évalué(e).",
      questions: [
        {
          id: "exerciseTypes",
          text: "3.1 - Quels types d'exercices préfères-tu ?",
          type: "multiple",
          options: [
            { value: "mcq", label: "QCM (choix multiples)" },
            { value: "trueFalse", label: "Vrai / Faux" },
            { value: "practical", label: "Exercices pratiques / projets" },
            { value: "essay", label: "Réponses à développement" },
            { value: "games", label: "Jeux, défis ou simulations" },
          ],
          required: true,
        },
        {
          id: "quizFrequency",
          text: "3.2 - Quelle fréquence de quiz te conviendrait ?",
          type: "single",
          options: [
            { value: "afterEachLesson", label: "Après chaque leçon" },
            { value: "afterEachModule", label: "Après chaque module" },
            { value: "revision", label: "Juste pour réviser" },
            { value: "minimum", label: "Le moins possible" },
          ],
          required: true,
        },
        {
          id: "errorHandling",
          text: "3.3 - Quand tu fais une erreur, tu préfères :",
          type: "single",
          options: [
            { value: "correctAnswer", label: "Voir juste la bonne réponse" },
            {
              value: "detailedExplanation",
              label: "Avoir une explication détaillée",
            },
            {
              value: "retryWithHint",
              label: "Refaire l'exercice avec un indice",
            },
            { value: "all", label: "Tout ça à la fois" },
          ],
          required: true,
        },
        {
          id: "evaluationType",
          text: "3.4 - Préfères-tu être évalué(e) par :",
          type: "single",
          options: [
            {
              value: "auto",
              label: "Des tests automatiques avec note immédiate",
            },
            { value: "manual", label: "Des projets avec évaluation manuelle" },
            { value: "self", label: "De l'auto-évaluation" },
            { value: "feedback", label: "Feedback personnalisé" },
          ],
          required: true,
        },
        {
          id: "difficultyLevel",
          text: "3.5 - Quel niveau de difficulté veux-tu ?",
          type: "single",
          options: [
            { value: "easy", label: "Facile pour bien démarrer" },
            { value: "medium", label: "Moyennement difficile pour progresser" },
            { value: "hard", label: "Difficile, j'aime les défis" },
            {
              value: "adaptive",
              label: "Adaptatif (s'ajuste selon les réponses)",
            },
          ],
          required: true,
        },
      ],
    },
    {
      id: "section4",
      title: "Environnement et motivation",
      description:
        "Aide-nous à comprendre ton environnement d'apprentissage idéal.",
      questions: [
        {
          id: "concentration",
          text: "4.1 - Quand es-tu le plus concentré(e) ?",
          type: "single",
          options: [
            { value: "morning", label: "Matin" },
            { value: "afternoon", label: "Après-midi" },
            { value: "evening", label: "Soir" },
            { value: "depends", label: "Cela dépend" },
          ],
          required: true,
        },
        {
          id: "preferredLocation",
          text: "4.2 - Où préfères-tu apprendre ?",
          type: "single",
          options: [
            { value: "quiet", label: "Endroit calme seul(e)" },
            { value: "group", label: "En groupe ou avec des échanges" },
            { value: "mobile", label: "En mobilité (smartphone, tablette)" },
            { value: "anywhere", label: "Peu importe, je m'adapte" },
          ],
          required: true,
        },
        {
          id: "motivation",
          text: "4.3 - Qu'est-ce qui te motive le plus ?",
          type: "multiple",
          options: [
            { value: "progress", label: "Voir ma progression" },
            { value: "goal", label: "Atteindre un objectif concret" },
            { value: "rewards", label: "Être récompensé(e) (badges, niveaux)" },
            { value: "passion", label: "Apprendre par passion" },
            { value: "challenge", label: "Être challengé(e)" },
          ],
          required: true,
        },
        {
          id: "difficulties",
          text: "4.4 - As-tu des difficultés spécifiques ?",
          type: "text",
          required: false,
        },
      ],
    },
    {
      id: "section5",
      title: "Ton avis",
      description: "Donne-nous ton avis pour améliorer notre plateforme.",
      questions: [
        {
          id: "idealMethod",
          text: "5.1 - Comment décrirais-tu ta méthode idéale pour apprendre en ligne ?",
          type: "text",
          required: false,
        },
      ],
    },
  ];

  const handleSingleChoice = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleMultipleChoice = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      if (currentAnswers.includes(value)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value],
        };
      }
    });

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleTextInput = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateSection = () => {
    const currentQuestions = sections[currentSection].questions;
    const newErrors: { [key: string]: string } = {};

    currentQuestions.forEach((question) => {
      if (question.required) {
        if (
          !answers[question.id] ||
          (question.type === "multiple" &&
            (answers[question.id] as string[]).length === 0)
        ) {
          newErrors[question.id] = "Cette question est obligatoire";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiError("");

    try {
      // Process answers before sending
      const processedAnswers = {
        userId: user?._id,
        sections: sections.map((section) => ({
          sectionId: section.id,
          title: section.title,
          answers: section.questions.map((question) => ({
            questionId: question.id,
            text: question.text,
            answer: answers[question.id] || "",
          })),
        })),
        // Process learning styles based on answers
        learningStyle: processLearningStyles(answers),
      };

      const response = await axios.post(
        "http://localhost:8000/user/learning-profile",
        processedAnswers
      );

      if (response.status === 200 || response.status === 201) {
        // Update local user data if needed

        // Navigate to dashboard after successful submission
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting learning profile:", error);
      setApiError(
        "Une erreur est survenue lors de l'enregistrement de ton profil. Réessaie plus tard."
      );

      // For development, still allow to continue
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process answers to determine learning style preferences
  const processLearningStyles = (answersData: {
    [key: string]: string | string[];
  }) => {
    const styles = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      theoretical: 0,
      practical: 0,
      social: 0,
      independent: 0,
    };

    // Visual learning indicators
    if (answersData.format && Array.isArray(answersData.format)) {
      if (answersData.format.includes("images")) styles.visual += 3;
      if (answersData.format.includes("videos")) styles.visual += 2;
    }
    if (answersData.imagesHelp === "veryMuch") styles.visual += 3;
    if (answersData.retentionMethod === "visualizing") styles.visual += 3;

    // Auditory learning indicators
    if (answersData.format && Array.isArray(answersData.format)) {
      if (answersData.format.includes("audio")) styles.auditory += 3;
    }
    if (answersData.listenOrRead === "listen") styles.auditory += 3;
    if (answersData.retentionMethod === "listening") styles.auditory += 3;

    // Kinesthetic learning indicators
    if (answersData.format && Array.isArray(answersData.format)) {
      if (answersData.format.includes("practice")) styles.kinesthetic += 3;
      if (answersData.format.includes("games")) styles.kinesthetic += 2;
    }
    if (answersData.retentionMethod === "practicing") styles.kinesthetic += 3;

    // Theoretical vs Practical
    if (answersData.courseType && Array.isArray(answersData.courseType)) {
      if (answersData.courseType.includes("theoretical"))
        styles.theoretical += 3;
      if (answersData.courseType.includes("practical")) styles.practical += 3;
    }

    // Social vs Independent learning
    if (answersData.preferredLocation === "group") styles.social += 3;
    if (answersData.preferredLocation === "quiet") styles.independent += 3;
    if (answersData.learningPace === "ownPace") styles.independent += 2;
    if (answersData.learningPace === "withGuidance") styles.social += 2;

    return styles;
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case "single":
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                  answers[question.id] === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={answers[question.id] === option.value}
                    onChange={() =>
                      handleSingleChoice(question.id, option.value)
                    }
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        );
      case "multiple":
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                  ((answers[question.id] as string[]) || []).includes(
                    option.value
                  )
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name={question.id}
                    value={option.value}
                    checked={(
                      (answers[question.id] as string[]) || []
                    ).includes(option.value)}
                    onChange={() =>
                      handleMultipleChoice(question.id, option.value)
                    }
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        );
      case "text":
        return (
          <div className="mt-3">
            <textarea
              name={question.id}
              value={(answers[question.id] as string) || ""}
              onChange={(e) => handleTextInput(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Écris ta réponse ici..."
            />
          </div>
        );
      default:
        return null;
    }
  };

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Profil d'Apprentissage Adaptatif
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Aide-nous à personnaliser ton expérience d'apprentissage.
            </p>

            {apiError && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {apiError}
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                <span>
                  Section {currentSection + 1} sur {sections.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {currentSectionData.title}
              </h2>
              <p className="text-gray-600">{currentSectionData.description}</p>
            </div>

            <div className="space-y-8">
              {currentSectionData.questions.map((question) => (
                <div
                  key={question.id}
                  className="pb-6 border-b border-gray-200 last:border-0"
                >
                  <h3 className="text-md font-medium text-gray-800">
                    {question.text}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                  {renderQuestionInput(question)}
                  {errors[question.id] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[question.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentSection === 0}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentSection === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Précédent
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : currentSection === sections.length - 1 ? (
                  <>
                    <FaCheck className="mr-2" />
                    Terminer
                  </>
                ) : (
                  <>
                    Suivant
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProfileQuiz;
