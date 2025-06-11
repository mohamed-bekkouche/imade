import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface LearningProfileProps {
  onComplete: (profile: any) => void;
  onBack: () => void;
}

const LearningProfile: React.FC<LearningProfileProps> = ({ onComplete, onBack }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    // Section 1: Ta façon de comprendre
    formats: [] as string[],
    styleContenu: "",
    dureeLecon: "",
    importanceImages: "",
    preferenceAudioTexte: "",
    methodeRetention: [] as string[],

    // Section 2: Préférences d'apprentissage
    rythmeApprentissage: [] as string[],
    typeCours: "",
    styleMotivation: [] as string[],

    // Section 3: Exercices, quiz & évaluation
    typeExercices: [] as string[],
    frequenceQuiz: "",
    gestionErreurs: [] as string[],
    typeEvaluation: [] as string[],
    niveauDifficulte: "",

    // Section 4: Environnement et motivation
    momentConcentration: "",
    lieuApprentissage: [] as string[],
    facteursMotivation: [] as string[],
    difficultesSpecifiques: "",

    // Section 5: Avis
    methodeIdeale: "",
  });

  const validateSection = (section: number) => {
    const newErrors: { [key: string]: string } = {};

    switch (section) {
      case 1:
        if (formData.formats.length === 0) newErrors.formats = "Veuillez sélectionner au moins un format.";
        if (!formData.styleContenu) newErrors.styleContenu = "Veuillez sélectionner un style de contenu.";
        if (!formData.dureeLecon) newErrors.dureeLecon = "Veuillez sélectionner une durée de leçon.";
        if (!formData.importanceImages) newErrors.importanceImages = "Veuillez indiquer l'importance des images.";
        if (!formData.preferenceAudioTexte) newErrors.preferenceAudioTexte = "Veuillez indiquer votre préférence.";
        if (formData.methodeRetention.length === 0) newErrors.methodeRetention = "Veuillez sélectionner au moins une méthode.";
        break;
      case 2:
        if (formData.rythmeApprentissage.length === 0) newErrors.rythmeApprentissage = "Veuillez sélectionner au moins un rythme.";
        if (!formData.typeCours) newErrors.typeCours = "Veuillez sélectionner un type de cours.";
        if (formData.styleMotivation.length === 0) newErrors.styleMotivation = "Veuillez sélectionner au moins un style.";
        break;
      case 3:
        if (formData.typeExercices.length === 0) newErrors.typeExercices = "Veuillez sélectionner au moins un type d'exercice.";
        if (!formData.frequenceQuiz) newErrors.frequenceQuiz = "Veuillez sélectionner une fréquence.";
        if (formData.gestionErreurs.length === 0) newErrors.gestionErreurs = "Veuillez sélectionner au moins une option.";
        if (formData.typeEvaluation.length === 0) newErrors.typeEvaluation = "Veuillez sélectionner au moins un type d'évaluation.";
        if (!formData.niveauDifficulte) newErrors.niveauDifficulte = "Veuillez sélectionner un niveau de difficulté.";
        break;
      case 4:
        if (!formData.momentConcentration) newErrors.momentConcentration = "Veuillez sélectionner un moment.";
        if (formData.lieuApprentissage.length === 0) newErrors.lieuApprentissage = "Veuillez sélectionner au moins un lieu.";
        if (formData.facteursMotivation.length === 0) newErrors.facteursMotivation = "Veuillez sélectionner au moins un facteur.";
        if (!formData.difficultesSpecifiques) newErrors.difficultesSpecifiques = "Veuillez décrire vos difficultés.";
        break;
      case 5:
        if (!formData.methodeIdeale) newErrors.methodeIdeale = "Veuillez décrire votre méthode idéale.";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (section: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[section as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [section]: newValues };
    });
    // Clear error when user makes a selection
    setErrors((prev) => ({ ...prev, [section]: "" }));
  };

  const handleInputChange = (section: string, value: string) => {
    setFormData((prev) => ({ ...prev, [section]: value }));
    // Clear error when user makes a selection
    setErrors((prev) => ({ ...prev, [section]: "" }));
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSection(currentSection)) {
      onComplete(formData);
    }
  };

  const renderSection1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">1. Ta façon de comprendre</h3>
      
      <div>
        <p className="mb-2">1.1 - Quels formats t'aident à mieux comprendre ?</p>
        <div className="space-y-2">
          {["Vidéos explicatives", "Images / schémas", "Texte écrit structuré", "Podcasts ou explications audio", "Exercices pratiques", "Jeux interactifs", "Études de cas ou mises en situation"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.formats.includes(option)}
                onChange={() => handleCheckboxChange("formats", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.formats && <p className="text-red-600 text-sm mt-1">{errors.formats}</p>}
      </div>

      <div>
        <p className="mb-2">1.2 - Quel style de contenu préfères-tu ?</p>
        <div className="space-y-2">
          {["Des explications simples et courtes", "Des explications détaillées et approfondies", "Un mélange des deux, selon les sujets"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="styleContenu"
                value={option}
                checked={formData.styleContenu === option}
                onChange={(e) => handleInputChange("styleContenu", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.styleContenu && <p className="text-red-600 text-sm mt-1">{errors.styleContenu}</p>}
      </div>

      <div>
        <p className="mb-2">1.3 - Quelle durée de leçon préfères-tu ?</p>
        <div className="space-y-2">
          {["Très courte (moins de 1 heures)", "Courte (5 à 10heurs)", "Moyenne (10 à 20 heures)", "Longue (plus de 20 heures)"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="dureeLecon"
                value={option}
                checked={formData.dureeLecon === option}
                onChange={(e) => handleInputChange("dureeLecon", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.dureeLecon && <p className="text-red-600 text-sm mt-1">{errors.dureeLecon}</p>}
      </div>

      <div>
        <p className="mb-2">1.4 - Est-ce que les images t'aident à mieux comprendre ?</p>
        <div className="space-y-2">
          {["Oui, énormément", "Un peu", "Pas vraiment"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="importanceImages"
                value={option}
                checked={formData.importanceImages === option}
                onChange={(e) => handleInputChange("importanceImages", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.importanceImages && <p className="text-red-600 text-sm mt-1">{errors.importanceImages}</p>}
      </div>

      <div>
        <p className="mb-2">1.5 - Préfères-tu écouter ou lire pour comprendre ?</p>
        <div className="space-y-2">
          {["Écouter (audio / vidéo)", "Lire (texte / support écrit)", "Les deux"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="preferenceAudioTexte"
                value={option}
                checked={formData.preferenceAudioTexte === option}
                onChange={(e) => handleInputChange("preferenceAudioTexte", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.preferenceAudioTexte && <p className="text-red-600 text-sm mt-1">{errors.preferenceAudioTexte}</p>}
      </div>

      <div>
        <p className="mb-2">1.6 - Comment retiens-tu mieux une information ?</p>
        <div className="space-y-2">
          {["En lisant", "En écoutant", "En pratiquant", "En répétant ou expliquant", "En visualisant (schémas, dessins)"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.methodeRetention.includes(option)}
                onChange={() => handleCheckboxChange("methodeRetention", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.methodeRetention && <p className="text-red-600 text-sm mt-1">{errors.methodeRetention}</p>}
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">2. Tes préférences d'apprentissage</h3>
      
      <div>
        <p className="mb-2">2.1 - Tu préfères apprendre :</p>
        <div className="space-y-2">
          {["À ton propre rythme", "Avec un calendrier et des deadlines", "Avec des rappels automatiques", "En étant accompagné(e)"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.rythmeApprentissage.includes(option)}
                onChange={() => handleCheckboxChange("rythmeApprentissage", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.rythmeApprentissage && <p className="text-red-600 text-sm mt-1">{errors.rythmeApprentissage}</p>}
      </div>

      <div>
        <p className="mb-2">2.2 - Tu préfères des cours :</p>
        <div className="space-y-2">
          {["Très théoriques", "Très pratiques", "Un bon équilibre des deux"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="typeCours"
                value={option}
                checked={formData.typeCours === option}
                onChange={(e) => handleInputChange("typeCours", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.typeCours && <p className="text-red-600 text-sm mt-1">{errors.typeCours}</p>}
      </div>

      <div>
        <p className="mb-2">2.3 - Quel style de cours te motive le plus ?</p>
        <div className="space-y-2">
          {["Interactif avec quiz et feedback", "Basé sur des projets ou des cas réels", "Gamifié (badges, niveaux, défis)", "Structuré comme un parcours classique"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.styleMotivation.includes(option)}
                onChange={() => handleCheckboxChange("styleMotivation", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.styleMotivation && <p className="text-red-600 text-sm mt-1">{errors.styleMotivation}</p>}
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">3. Exercices, quiz & évaluation</h3>
      
      <div>
        <p className="mb-2">3.1 - Quels types d'exercices préfères-tu ?</p>
        <div className="space-y-2">
          {["QCM (choix multiples)", "Vrai / Faux", "Exercices pratiques / projets", "Réponses à développement", "Jeux, défis ou simulations"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.typeExercices.includes(option)}
                onChange={() => handleCheckboxChange("typeExercices", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.typeExercices && <p className="text-red-600 text-sm mt-1">{errors.typeExercices}</p>}
      </div>

      <div>
        <p className="mb-2">3.2 - Quelle fréquence de quiz te conviendrait ?</p>
        <div className="space-y-2">
          {["Après chaque leçon", "Après chaque module", "Juste pour réviser", "Le moins possible"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="frequenceQuiz"
                value={option}
                checked={formData.frequenceQuiz === option}
                onChange={(e) => handleInputChange("frequenceQuiz", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.frequenceQuiz && <p className="text-red-600 text-sm mt-1">{errors.frequenceQuiz}</p>}
      </div>

      <div>
        <p className="mb-2">3.3 - Quand tu fais une erreur, tu préfères :</p>
        <div className="space-y-2">
          {["Voir juste la bonne réponse", "Avoir une explication détaillée", "Refaire l'exercice avec un indice", "Tout ça à la fois"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.gestionErreurs.includes(option)}
                onChange={() => handleCheckboxChange("gestionErreurs", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.gestionErreurs && <p className="text-red-600 text-sm mt-1">{errors.gestionErreurs}</p>}
      </div>

      <div>
        <p className="mb-2">3.4 - Préfères-tu être évalué(e) par :</p>
        <div className="space-y-2">
          {["Des tests automatiques avec note immédiate", "Des projets avec évaluation manuelle", "De l'auto-évaluation", "Feedback personnalisé"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.typeEvaluation.includes(option)}
                onChange={() => handleCheckboxChange("typeEvaluation", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.typeEvaluation && <p className="text-red-600 text-sm mt-1">{errors.typeEvaluation}</p>}
      </div>

      <div>
        <p className="mb-2">3.5 - Quel niveau de difficulté veux-tu ?</p>
        <div className="space-y-2">
          {["Facile pour bien démarrer", "Moyennement difficile pour progresser", "Difficile, j'aime les défis", "Adaptatif (s'ajuste selon les réponses)"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="niveauDifficulte"
                value={option}
                checked={formData.niveauDifficulte === option}
                onChange={(e) => handleInputChange("niveauDifficulte", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.niveauDifficulte && <p className="text-red-600 text-sm mt-1">{errors.niveauDifficulte}</p>}
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">4. Environnement et motivation</h3>
      
      <div>
        <p className="mb-2">4.1 - Quand es-tu le plus concentré(e) ?</p>
        <div className="space-y-2">
          {["Matin", "Après-midi", "Soir", "Cela dépend"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="momentConcentration"
                value={option}
                checked={formData.momentConcentration === option}
                onChange={(e) => handleInputChange("momentConcentration", e.target.value)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.momentConcentration && <p className="text-red-600 text-sm mt-1">{errors.momentConcentration}</p>}
      </div>

      <div>
        <p className="mb-2">4.2 - Où préfères-tu apprendre ?</p>
        <div className="space-y-2">
          {["Endroit calme seul(e)", "En groupe ou avec des échanges", "En mobilité (smartphone, tablette)", "Peu importe, je m'adapte"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.lieuApprentissage.includes(option)}
                onChange={() => handleCheckboxChange("lieuApprentissage", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.lieuApprentissage && <p className="text-red-600 text-sm mt-1">{errors.lieuApprentissage}</p>}
      </div>

      <div>
        <p className="mb-2">4.3 - Qu'est-ce qui te motive le plus ?</p>
        <div className="space-y-2">
          {["Voir ma progression", "Atteindre un objectif concret", "Être récompensé(e) (badges, niveaux)", "Apprendre par passion", "Être challengé(e)"].map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facteursMotivation.includes(option)}
                onChange={() => handleCheckboxChange("facteursMotivation", option)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors.facteursMotivation && <p className="text-red-600 text-sm mt-1">{errors.facteursMotivation}</p>}
      </div>

      <div>
        <p className="mb-2">4.4 - As-tu des difficultés spécifiques ?</p>
        <textarea
          value={formData.difficultesSpecifiques}
          onChange={(e) => handleInputChange("difficultesSpecifiques", e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Décris tes difficultés spécifiques..."
        />
        {errors.difficultesSpecifiques && <p className="text-red-600 text-sm mt-1">{errors.difficultesSpecifiques}</p>}
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">5. Ton avis</h3>
      
      <div>
        <p className="mb-2">5.1 - Comment décrirais-tu ta méthode idéale pour apprendre en ligne ?</p>
        <textarea
          value={formData.methodeIdeale}
          onChange={(e) => handleInputChange("methodeIdeale", e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Décris ta méthode idéale d'apprentissage..."
        />
        {errors.methodeIdeale && <p className="text-red-600 text-sm mt-1">{errors.methodeIdeale}</p>}
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
      case 5:
        return renderSection5();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Profil d'Apprentissage Adaptatif</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderCurrentSection()}
        
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => currentSection > 1 ? setCurrentSection(currentSection - 1) : onBack()}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft className="mr-2" />
            {currentSection > 1 ? "Précédent" : "Retour"}
          </button>
          
          {currentSection < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Suivant
              <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Terminer
              <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LearningProfile; 