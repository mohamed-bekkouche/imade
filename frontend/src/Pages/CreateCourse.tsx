// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
// import courseService from "../services/courseService";

// const CreateCourse = () => {
//   const navigate = useNavigate();
//   const { user } = useAuthStore();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFormat, setSelectedFormat] = useState("");

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const form = e.currentTarget as HTMLFormElement;
//       const formData = new FormData();

//       // Get form elements
//       const titleInput = form.elements.namedItem("title") as HTMLInputElement;
//       const descriptionInput = form.elements.namedItem(
//         "description"
//       ) as HTMLTextAreaElement;
//       const categoryInput = form.elements.namedItem(
//         "category"
//       ) as HTMLSelectElement;
//       const levelInput = form.elements.namedItem("level") as HTMLSelectElement;
//       const formatInput = form.elements.namedItem(
//         "format"
//       ) as HTMLSelectElement;
//       const durationInput = form.elements.namedItem(
//         "duration"
//       ) as HTMLSelectElement;
//       const thumbnailInput = form.elements.namedItem(
//         "thumbnail"
//       ) as HTMLInputElement;
//       const pdfInput = form.elements.namedItem("pdf") as HTMLInputElement;
//       const linkInput = form.elements.namedItem("link") as HTMLInputElement;

//       // Add all form fields to FormData
//       formData.append("title", titleInput.value);
//       formData.append("description", descriptionInput.value);
//       formData.append("category", categoryInput.value);
//       formData.append("level", levelInput.value);
//       formData.append("format", formatInput.value);
//       formData.append("duration", durationInput.value);

//       // Handle file uploads
//       const thumbnailFile = thumbnailInput.files?.[0];
//       const pdfFile = pdfInput.files?.[0];

//       // Validate required fields based on format
//       if (!thumbnailFile) {
//         setError("L'image miniature est requise.");
//         setLoading(false);
//         return;
//       }

//       if (formatInput.value === "pdf" && !pdfFile) {
//         setError("Le fichier PDF est requis pour le format PDF.");
//         setLoading(false);
//         return;
//       }

//       if (formatInput.value === "video" && !linkInput.value) {
//         setError("Le lien vidéo est requis pour le format vidéo.");
//         setLoading(false);
//         return;
//       }

//       // Append files and link if present
//       formData.append("thumbnail", thumbnailFile);
//       if (pdfFile) {
//         formData.append("pdf", pdfFile);
//       }
//       if (linkInput.value) {
//         formData.append("link", linkInput.value);
//       }

//       // Send request with proper headers for multipart/form-data
//       // await api.post('/teacher/courses', formData, {
//       //   headers: {
//       //     'Content-Type': 'multipart/form-data',
//       //   },
//       // });
//       const data = await courseService.createCourse(formData);
//       console.log("Course created successfully:", data);
//       navigate("/teacher");
//     } catch (err: any) {
//       console.error("Error creating course:", err);
//       setError(
//         err.response?.data?.message ||
//           "Échec de la création du cours. Veuillez réessayer plus tard."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!user || user?.role !== "teacher") {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-md p-8">
//           <h1 className="text-2xl font-bold text-gray-900 mb-8">
//             Créer un nouveau cours
//           </h1>

//           {error && (
//             <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Titre *
//                   <input
//                     type="text"
//                     name="title"
//                     required
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     placeholder="Entrez le titre du cours"
//                   />
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Description *
//                   <textarea
//                     name="description"
//                     required
//                     rows={4}
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     placeholder="Décrivez le contenu du cours"
//                   />
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Catégorie *
//                   <select
//                     name="category"
//                     required
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">Sélectionnez une catégorie</option>
//                     <option value="Développement web">Développement web</option>
//                     <option value="Développement mobile">
//                       Développement mobile
//                     </option>
//                     <option value="Développement application mobile">
//                       Développement application mobile
//                     </option>
//                     <option value="Machine Learning">Machine Learning</option>
//                     <option value="Data Science">Data Science</option>
//                     <option value="Cybersécurité">Cybersécurité</option>
//                     <option value="Automatisation">Automatisation</option>
//                     <option value="Autre">Autre</option>
//                   </select>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Format *
//                   <select
//                     name="format"
//                     required
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                     onChange={(e) => setSelectedFormat(e.target.value)}
//                   >
//                     <option value="">Sélectionnez un format</option>
//                     <option value="pdf">PDF</option>
//                     <option value="video">Vidéo</option>
//                   </select>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Niveau *
//                   <select
//                     name="level"
//                     required
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">Sélectionnez un niveau</option>
//                     <option value="Débutant">Débutant</option>
//                     <option value="Intermédiaire">Intermédiaire</option>
//                     <option value="Avancé">Avancé</option>
//                   </select>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Durée *
//                   <select
//                     name="duration"
//                     required
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   >
//                     <option value="">Sélectionnez une durée</option>
//                     <option value="Courte (moins de 1 mois)">
//                       Courte (moins de 1 mois)
//                     </option>
//                     <option value="Moyenne (1 à 3 mois)">
//                       Moyenne (1 à 3 mois)
//                     </option>
//                     <option value="Longue (3 mois et plus)">
//                       Longue (3 mois et plus)
//                     </option>
//                   </select>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   PDF du cours {selectedFormat === "pdf" && "*"}
//                   <input
//                     type="file"
//                     name="pdf"
//                     accept=".pdf"
//                     required={selectedFormat === "pdf"}
//                     className="mt-2 block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-blue-50 file:text-blue-700
//                       hover:file:bg-blue-100"
//                   />
//                   <p className="mt-2 text-sm text-gray-500">
//                     {selectedFormat === "pdf"
//                       ? "Requis pour le format PDF"
//                       : "Optionnel pour le format vidéo"}
//                   </p>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Miniature *
//                   <input
//                     type="file"
//                     name="thumbnail"
//                     accept="image/*"
//                     required
//                     className="mt-2 block w-full text-sm text-gray-500
//                       file:mr-4 file:py-2 file:px-4
//                       file:rounded-md file:border-0
//                       file:text-sm file:font-semibold
//                       file:bg-blue-50 file:text-blue-700
//                       hover:file:bg-blue-100"
//                   />
//                   <p className="mt-2 text-sm text-gray-500">
//                     Image de présentation du cours (obligatoire)
//                   </p>
//                 </label>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Lien vidéo {selectedFormat === "video" && "*"}
//                   <input
//                     type="url"
//                     name="link"
//                     required={selectedFormat === "video"}
//                     placeholder="https://youtu.be/..."
//                     className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                   />
//                   <p className="mt-2 text-sm text-gray-500">
//                     {selectedFormat === "video"
//                       ? "Requis pour le format vidéo"
//                       : "Optionnel pour le format PDF"}
//                   </p>
//                 </label>
//               </div>
//             </div>

//             <div className="pt-8 flex items-center justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={() => navigate("/teacher")}
//                 className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium ${
//                   loading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {loading ? "Création..." : "Créer le cours"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCourse;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import courseService from "../services/courseService";

const CreateCourse = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([
    { title: "", format: "video", link: "" },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData();

      // Get basic course info
      const titleInput = form.elements.namedItem("title") as HTMLInputElement;
      const descriptionInput = form.elements.namedItem(
        "description"
      ) as HTMLTextAreaElement;
      const categoryInput = form.elements.namedItem(
        "category"
      ) as HTMLSelectElement;
      const levelInput = form.elements.namedItem("level") as HTMLSelectElement;
      const durationInput = form.elements.namedItem(
        "duration"
      ) as HTMLSelectElement;
      const thumbnailInput = form.elements.namedItem(
        "thumbnail"
      ) as HTMLInputElement;

      // Add basic course fields to FormData
      formData.append("title", titleInput.value);
      formData.append("description", descriptionInput.value);
      formData.append("category", categoryInput.value);
      formData.append("level", levelInput.value);
      formData.append("duration", durationInput.value);

      // Handle thumbnail file
      const thumbnailFile = thumbnailInput.files?.[0];
      if (!thumbnailFile) {
        setError("L'image miniature est requise.");
        setLoading(false);
        return;
      }
      formData.append("thumbnail", thumbnailFile);

      // Handle lessons
      lessons.forEach((lesson, index) => {
        formData.append(
          `lessons[${index}]`,
          JSON.stringify({
            title: lesson.title,
            format: lesson.format,
            link: lesson.format === "video" ? lesson.link : "",
          })
        );

        // Handle PDF files for lessons if format is PDF
        if (lesson.format === "pdf") {
          const pdfInput = form.elements.namedItem(
            `pdf-${index}`
          ) as HTMLInputElement;
          const pdfFile = pdfInput?.files?.[0];
          if (!pdfFile) {
            setError(`Le fichier PDF est requis pour la leçon ${index + 1}`);
            setLoading(false);
            return;
          }
          formData.append("pdfs", pdfFile);
        }
      });

      // Send request
      const data = await courseService.createCourse(formData);
      console.log("Course created successfully:", data);
      navigate("/teacher");
    } catch (err: any) {
      console.error("Error creating course:", err);
      setError(
        err.response?.data?.message ||
          "Échec de la création du cours. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLessonChange = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: "", format: "video", link: "" }]);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      setLessons(updatedLessons);
    }
  };

  useEffect(() => {
    if (!user || user?.role !== "teacher") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Créer un nouveau cours
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
            encType="multipart/form-data"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Titre *
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Entrez le titre du cours"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Décrivez le contenu du cours"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie *
                  <select
                    name="category"
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    <option value="Développement web">Développement web</option>
                    <option value="Développement mobile">
                      Développement mobile
                    </option>
                    <option value="Développement application mobile">
                      Développement application mobile
                    </option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cybersécurité">Cybersécurité</option>
                    <option value="Automatisation">Automatisation</option>
                    <option value="Autre">Autre</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Niveau *
                  <select
                    name="level"
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un niveau</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Durée *
                  <select
                    name="duration"
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une durée</option>
                    <option value="Courte (moins de 1 mois)">
                      Courte (moins de 1 mois)
                    </option>
                    <option value="Moyenne (1 à 3 mois)">
                      Moyenne (1 à 3 mois)
                    </option>
                    <option value="Longue (3 mois et plus)">
                      Longue (3 mois et plus)
                    </option>
                  </select>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Miniature *
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    required
                    className="mt-2 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Image de présentation du cours (obligatoire)
                  </p>
                </label>
              </div>
            </div>

            {/* Lessons section */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-900">Leçons</h2>

              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Leçon {index + 1}
                    </h3>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Titre de la leçon *
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(index, "title", e.target.value)
                          }
                          required
                          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Titre de la leçon"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Format *
                        <select
                          value={lesson.format}
                          onChange={(e) =>
                            handleLessonChange(index, "format", e.target.value)
                          }
                          required
                          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="video">Vidéo</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </label>
                    </div>

                    {lesson.format === "video" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Lien vidéo *
                          <input
                            type="url"
                            name={`link-${index}`}
                            value={lesson.link}
                            onChange={(e) =>
                              handleLessonChange(index, "link", e.target.value)
                            }
                            required={lesson.format === "video"}
                            placeholder="https://youtu.be/..."
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </label>
                      </div>
                    )}

                    {lesson.format === "pdf" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Fichier PDF *
                          <input
                            type="file"
                            name={`pdf-${index}`}
                            accept=".pdf"
                            required={lesson.format === "pdf"}
                            className="mt-2 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLesson}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors duration-200 font-medium"
              >
                + Ajouter une leçon
              </button>
            </div>

            <div className="pt-8 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/teacher")}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Création..." : "Créer le cours"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
