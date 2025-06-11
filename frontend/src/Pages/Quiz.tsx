import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Quiz, QuizAttempt, UserAnswer } from "../types/types";
import quizService from "../services/quizService";
import { Course } from "../types/Course";
import courseService from "../services/courseService";
import {
  FaBookmark,
  FaClock,
  FaStar,
  FaThumbsUp,
  FaUser,
} from "react-icons/fa";
import AIContentRenderer, { AIContent } from "../components/AiContent";
import CourseResourcesRenderer, {
  CourseResources,
} from "../components/CourseResources";
import { useAuthStore } from "../store/authStore";
import { User } from "../types/User";

const QuizPage: React.FC = () => {
  const { user } = useAuthStore() as {
    user: User | null;
  };
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPassed, setIsPassed] = useState<boolean>(false);
  const [recommendedCourse, setRecommendedCourse] = useState<Course | null>(
    null
  );
  const [courseResource, setCourseResource] = useState<CourseResources | null>(
    null
  );
  const [enhancedCourse, setEnhancedCourse] = useState<AIContent | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuiz(quizId as string);
        console.log("Quiz data  : ", data);
        if (data.message === "You Already Pass the Quiz") {
          setIsPassed(true);
          setMessage(data.message);
          return;
        }

        if (data.message === "You Need First to Enhance the Lesson") {
          const lessonId = data.lessonId;
          const [enhancedData, resourceData] = await Promise.all([
            courseService.enhanceCourse(lessonId),
            courseService.getCourseResource(lessonId),
          ]);

          setEnhancedCourse(enhancedData.ai);
          setCourseResource(resourceData.ai);
          setMessage("Course Enhanced Successfully");
          return;
        }

        if (
          data.message ===
          "You Already Fail in this Quiz , You can't pass it aggain"
        ) {
          const recommendedData = await courseService.getCourseRecommendedKnn(
            data.courseId
          );
          setRecommendedCourse(recommendedData.courseRecommended);
          setMessage("This Is The New Recommended Course");
          return;
        }
        const quizData: Quiz = data.quiz;
        // Initialize userAnswers array with empty arrays for multiple choice questions
        setUserAnswers(
          quizData.questions.map((question) =>
            question.correctAnswers.length > 1 ? [] : ""
          )
        );
        setQuiz(quizData);

        if (data.message) {
          setMessage(data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionIndex: number, answer: UserAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quiz) return;

    try {
      const formattedAnswers = userAnswers.map((answer) => {
        if (Array.isArray(answer)) {
          return answer.filter((item) => item !== "");
        }
        return answer;
      });

      const data = await quizService.evaluateQuiz({
        answers: formattedAnswers,
        quizId: quiz._id,
      });

      setQuizAttempt(data.quizAttempt);
      setSubmitted(true);
      setMessage(data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit quiz");
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await courseService.handleEnroll(courseId);
      // You might want to refresh the course data or show a success message
      alert("Inscription réussie!");
    } catch (error: any) {
      console.error("Error enrolling in course:", error);
      alert(
        error.response?.data?.message || "Erreur lors de l'inscription au cours"
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading quiz...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  if (message && !quiz)
    return (
      <>
        {enhancedCourse ? (
          <>
            <AIContentRenderer aiContent={enhancedCourse} />
            {courseResource && (
              <CourseResourcesRenderer resources={courseResource} />
            )}
          </>
        ) : (
          <>
            <div className="flex justify-center items-center py-8 text-2xl">
              {message}
            </div>
            {recommendedCourse && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 max-w-5xl mx-auto mb-10">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 rounded-full p-3 mr-4">
                    <FaThumbsUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Cours Recommandé Pour Vous
                    </h2>
                    <p className="text-gray-600">
                      Basé sur votre profil d'apprentissage
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-64 md:h-full relative">
                        <img
                          src={
                            "http://localhost:8000/" +
                            recommendedCourse.thumbnail
                          }
                          alt={recommendedCourse.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://placehold.co/400x300/e2e8f0/1e40af?text=${encodeURIComponent(
                              recommendedCourse.title
                            )}`;
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center">
                            <FaBookmark className="mr-1 h-3 w-3" />
                            Recommandé
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {recommendedCourse.category}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          {recommendedCourse.level}
                        </span>
                      </div>

                      <Link to={`/course/${recommendedCourse._id}`}>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                          {recommendedCourse.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {recommendedCourse.description}
                      </p>

                      <div className="flex items-center mb-4 text-sm text-gray-500">
                        <FaUser className="mr-2" />
                        <span className="mr-6">
                          Par {recommendedCourse.teacher.firstName}{" "}
                          {recommendedCourse.teacher.lastName}
                        </span>
                        <FaClock className="mr-2" />
                        <span className="mr-6">
                          {recommendedCourse.duration}
                        </span>
                        {recommendedCourse.rating && (
                          <>
                            <FaStar className="mr-1 text-yellow-400" />
                            <span>{recommendedCourse.rating.toFixed(1)}</span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-4">
                        {recommendedCourse.enrolledStudents?.includes(
                          user._id
                        ) ? (
                          <Link
                            to={"/courses/" + recommendedCourse._id}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium"
                          >
                            Lire{" "}
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleEnroll(recommendedCourse._id)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium"
                          >
                            S'inscrire maintenant
                          </button>
                        )}

                        <Link
                          to={`/course/${recommendedCourse._id}`}
                          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center font-medium"
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen">
        Quiz not found
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>

      {message && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          {message}
        </div>
      )}

      {submitted && quizAttempt ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <p
            className={`text-lg mb-2 ${
              quizAttempt.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            Score: {quizAttempt.score.toFixed(1)}%
          </p>
          <p
            className={`text-lg mb-6 font-semibold ${
              quizAttempt.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {quizAttempt.passed
              ? "Congratulations! You passed the quiz."
              : "You did not pass this time. Keep practicing!"}
          </p>

          <div className="space-y-6">
            {quiz.questions.map((question, qIndex) => {
              const userAnswer = quizAttempt.answers[qIndex];
              const isCorrect = Array.isArray(userAnswer)
                ? // For multiple answers, check if all correct answers are selected and no incorrect ones
                  userAnswer.length === question.correctAnswers.length &&
                  userAnswer.every((ans) =>
                    question.correctAnswers.includes(ans)
                  )
                : // For single answer, check if it matches any correct answer
                  question.correctAnswers.includes(userAnswer as string);

              return (
                <div
                  key={qIndex}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">
                    Question {qIndex + 1}: {question.questionText}
                  </h3>
                  <p className="mb-1">
                    <span className="font-medium">Your answer:</span>{" "}
                    {Array.isArray(userAnswer)
                      ? userAnswer.length > 0
                        ? userAnswer.join(", ")
                        : "No answer selected"
                      : userAnswer || "No answer selected"}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Correct answer(s):</span>{" "}
                    {question.correctAnswers.join(", ")}
                  </p>
                  {question.explanation && (
                    <p className="mt-2 text-gray-600 italic">
                      <span className="font-medium">Explanation:</span>{" "}
                      {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {!isPassed && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="space-y-8">
                {quiz.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      Question {qIndex + 1}: {question.questionText}
                    </h3>

                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center">
                          {question.correctAnswers.length > 1 ? (
                            // Checkbox for multiple correct answers
                            <input
                              type="checkbox"
                              id={`q${qIndex}-o${oIndex}`}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              checked={
                                Array.isArray(userAnswers[qIndex])
                                  ? (userAnswers[qIndex] as string[]).includes(
                                      option
                                    )
                                  : false
                              }
                              onChange={() => {
                                const currentAnswers = Array.isArray(
                                  userAnswers[qIndex]
                                )
                                  ? [...(userAnswers[qIndex] as string[])]
                                  : [];

                                if (currentAnswers.includes(option)) {
                                  handleAnswerChange(
                                    qIndex,
                                    currentAnswers.filter((a) => a !== option)
                                  );
                                } else {
                                  handleAnswerChange(qIndex, [
                                    ...currentAnswers,
                                    option,
                                  ]);
                                }
                              }}
                            />
                          ) : (
                            // Radio button for single correct answer
                            <input
                              type="radio"
                              id={`q${qIndex}-o${oIndex}`}
                              name={`question-${qIndex}`}
                              value={option}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={userAnswers[qIndex] === option}
                              onChange={() =>
                                handleAnswerChange(qIndex, option)
                              }
                            />
                          )}
                          <label
                            htmlFor={`q${qIndex}-o${oIndex}`}
                            className="ml-2 block text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Submit Quiz
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
