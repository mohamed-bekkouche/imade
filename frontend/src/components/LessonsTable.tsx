// import { FaTrash, FaFilePdf, FaVideo } from "react-icons/fa";
// import { Lesson } from "../types/Lesson";

// interface LessonsTableProps {
//   lessons: Lesson[];
//   loading: boolean;
//   error: string;
//   onDelete: (id: string) => void;
// }

// const LessonsTable = ({
//   lessons,
//   loading,
//   error,
//   onDelete,
// }: LessonsTableProps) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     );
//   }

//   const handleDownloadPdf = (pdfUrl: string, title: string) => {
//     const link = document.createElement("a");
//     link.href = "http://localhost:8000/" + pdfUrl;
//     link.download = `${title}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//       <h2 className="text-xl font-semibold mb-6">Lessons</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50">
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Format
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Content
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {lessons.length > 0 ? (
//               lessons.map((lesson) => (
//                 <tr key={lesson._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {lesson.title}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
//                         lesson.format === "pdf"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-blue-100 text-blue-800"
//                       }`}
//                     >
//                       {lesson.format === "pdf" ? (
//                         <FaFilePdf className="mr-1" />
//                       ) : (
//                         <FaVideo className="mr-1" />
//                       )}
//                       {lesson.format}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {lesson.format === "pdf" ? (
//                       <button
//                         onClick={() =>
//                           lesson.pdf &&
//                           handleDownloadPdf(lesson.pdf, lesson.title)
//                         }
//                         className="text-blue-600 hover:text-blue-800 flex items-center"
//                         disabled={!lesson.pdf}
//                       >
//                         <FaFilePdf className="mr-1" />
//                         {lesson.pdf ? "Download PDF" : "No PDF"}
//                       </button>
//                     ) : (
//                       <a
//                         href={lesson.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 flex items-center"
//                       >
//                         <FaVideo className="mr-1" />
//                         {lesson.link ? "Watch Video" : "No Link"}
//                       </a>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {lesson.order || "-"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
//                     <button
//                       onClick={() => onDelete(lesson._id)}
//                       className="text-red-600 hover:text-red-900 cursor-pointer"
//                       title="Delete lesson"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                   No lessons found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LessonsTable;

import React, { useState } from "react";
import { FaTrash, FaFilePdf, FaVideo, FaPlus, FaTimes } from "react-icons/fa";
import { Lesson } from "../types/Lesson";
import quizService from "../services/quizService";
import { toast, Toaster } from "react-hot-toast";

interface LessonsTableProps {
  lessons: Lesson[];
  loading: boolean;
  error: string;
  onDelete: (id: string) => void;
}

interface Question {
  questionText: string;
  options: string[];
  correctAnswers: string[];
  difficultyLevel: number;
}

export interface QuizFormData {
  passingScore: number;
  questions: Question[];
}

const LessonsTable = ({
  lessons,
  loading,
  error,
  onDelete,
}: LessonsTableProps) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [quizFormData, setQuizFormData] = useState<QuizFormData>({
    passingScore: 50,
    questions: [
      {
        questionText: "",
        options: ["", ""],
        correctAnswers: [],
        difficultyLevel: 1,
      },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const handleDownloadPdf = (pdfUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = "http://localhost:8000/" + pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateQuiz = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setShowQuizModal(true);
  };

  const handleCloseModal = () => {
    setShowQuizModal(false);
    setSelectedLessonId("");
    setQuizFormData({
      passingScore: 50,
      questions: [
        {
          questionText: "",
          options: ["", ""],
          correctAnswers: [],
          difficultyLevel: 1,
        },
      ],
    });
  };

  const addQuestion = () => {
    setQuizFormData({
      ...quizFormData,
      questions: [
        ...quizFormData.questions,
        {
          questionText: "",
          options: ["", ""],
          correctAnswers: [],
          difficultyLevel: 1,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = quizFormData.questions.filter((_, i) => i !== index);
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const updateQuestion = (index: number, field: string, value) => {
    const newQuestions = [...quizFormData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...quizFormData.questions];
    newQuestions[questionIndex].options.push("");
    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...quizFormData.questions];
    const removedOption = newQuestions[questionIndex].options[optionIndex];

    // Remove the option
    newQuestions[questionIndex].options = newQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);

    // Remove from correct answers if it was selected
    newQuestions[questionIndex].correctAnswers = newQuestions[
      questionIndex
    ].correctAnswers.filter((answer) => answer !== removedOption);

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...quizFormData.questions];
    const oldValue = newQuestions[questionIndex].options[optionIndex];
    newQuestions[questionIndex].options[optionIndex] = value;

    // Update correct answers if the option was changed
    newQuestions[questionIndex].correctAnswers = newQuestions[
      questionIndex
    ].correctAnswers.map((answer) => (answer === oldValue ? value : answer));

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const toggleCorrectAnswer = (questionIndex: number, option: string) => {
    const newQuestions = [...quizFormData.questions];
    const correctAnswers = newQuestions[questionIndex].correctAnswers;

    if (correctAnswers.includes(option)) {
      newQuestions[questionIndex].correctAnswers = correctAnswers.filter(
        (answer) => answer !== option
      );
    } else {
      newQuestions[questionIndex].correctAnswers = [...correctAnswers, option];
    }

    setQuizFormData({
      ...quizFormData,
      questions: newQuestions,
    });
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await quizService.createQuizForLesson({
        isCourse: false,
        courseId: selectedLessonId,
        passingScore: quizFormData.passingScore,
        questions: quizFormData.questions,
      });

      toast.success("Quiz created successfully!");
      handleCloseModal();
      // You might want to refresh the lessons data here
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create quiz. Please try again.");
      console.error("Error creating quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Lessons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lesson.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          lesson.format === "pdf"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {lesson.format === "pdf" ? (
                          <FaFilePdf className="mr-1" />
                        ) : (
                          <FaVideo className="mr-1" />
                        )}
                        {lesson.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.format === "pdf" ? (
                        <button
                          onClick={() =>
                            lesson.pdf &&
                            handleDownloadPdf(lesson.pdf, lesson.title)
                          }
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                          disabled={!lesson.pdf}
                        >
                          <FaFilePdf className="mr-1" />
                          {lesson.pdf ? "Download PDF" : "No PDF"}
                        </button>
                      ) : (
                        <a
                          href={lesson.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FaVideo className="mr-1" />
                          {lesson.link ? "Watch Video" : "No Link"}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.order || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.quiz ? (
                        <span className="text-green-600 font-medium">
                          Has Quiz
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCreateQuiz(lesson._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center"
                        >
                          <FaPlus className="mr-1" />
                          Create Quiz
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      <button
                        onClick={() => onDelete(lesson._id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete lesson"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No lessons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Creation Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create Quiz</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitQuiz}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quizFormData.passingScore}
                  onChange={(e) =>
                    setQuizFormData({
                      ...quizFormData,
                      passingScore: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-700">
                    Questions
                  </h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" />
                    Add Question
                  </button>
                </div>

                {quizFormData.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">
                        Question {questionIndex + 1}
                      </h5>
                      {quizFormData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <textarea
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "questionText",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty Level (1-5)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={question.difficultyLevel}
                        onChange={(e) =>
                          updateQuestion(
                            questionIndex,
                            "difficultyLevel",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        <button
                          type="button"
                          onClick={() => addOption(questionIndex)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs flex items-center"
                        >
                          <FaPlus className="mr-1" />
                          Add Option
                        </button>
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-2"
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                questionIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <label className="flex items-center mr-2">
                            <input
                              type="checkbox"
                              checked={question.correctAnswers.includes(option)}
                              onChange={() =>
                                toggleCorrectAnswer(questionIndex, option)
                              }
                              className="mr-1"
                            />
                            <span className="text-sm text-gray-600">
                              Correct
                            </span>
                          </label>
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LessonsTable;
