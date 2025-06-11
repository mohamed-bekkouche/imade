import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number[];
  wrongAnswers: number[];
}

const CourseQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult>({
    score: 0,
    totalQuestions: 0,
    correctAnswers: [],
    wrongAnswers: [],
  });

  // Static quiz questions (in a real app, these would come from an API)
  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "What is the main purpose of React?",
      options: [
        "To manage server-side rendering",
        "To build user interfaces",
        "To handle database operations",
        "To create mobile applications",
      ],
      correctAnswer: 1,
      explanation:
        "React is a JavaScript library for building user interfaces.",
    },
    {
      id: 2,
      question:
        "Which hook is used to perform side effects in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation:
        "useEffect is used to perform side effects in functional components.",
    },
    {
      id: 3,
      question: "What is JSX?",
      options: [
        "A JavaScript extension for XML",
        "A template language",
        "A state management library",
        "A CSS preprocessor",
      ],
      correctAnswer: 0,
      explanation:
        "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript.",
    },
    {
      id: 4,
      question: "What is the virtual DOM?",
      options: [
        "A copy of the real DOM",
        "A lightweight version of the browser DOM",
        "A programming concept for UI updates",
        "All of the above",
      ],
      correctAnswer: 3,
      explanation:
        "The virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates.",
    },
    {
      id: 5,
      question: "How do you update the state in a class component?",
      options: [
        "this.state = { ... }",
        "this.setState({ ... })",
        "this.updateState({ ... })",
        "setState({ ... })",
      ],
      correctAnswer: 1,
      explanation:
        "In class components, you use this.setState() to update the state.",
    },
  ];

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setQuizResult((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: quizQuestions.length,
      correctAnswers: isCorrect
        ? [...prev.correctAnswers, currentQuestion.id]
        : prev.correctAnswers,
      wrongAnswers: !isCorrect
        ? [...prev.wrongAnswers, currentQuestion.id]
        : prev.wrongAnswers,
    }));

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setQuizResult({
      score: 0,
      totalQuestions: 0,
      correctAnswers: [],
      wrongAnswers: [],
    });
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Quiz</h1>
          <p className="text-gray-600 mb-8">
            Test your knowledge with this {quizQuestions.length}-question quiz.
            You'll have one attempt per question. Good luck!
          </p>
          <button
            onClick={startQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 flex items-center mx-auto"
          >
            Start Quiz <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round(
      (quizResult.score / quizResult.totalQuestions) * 100
    );

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Quiz Results
          </h1>

          <div className="text-center mb-8">
            <div className="text-5xl font-bold mb-2 text-blue-600">
              {percentage}%
            </div>
            <div className="text-gray-600 mb-4">
              You scored {quizResult.score} out of {quizResult.totalQuestions}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
              <div
                className={`h-4 rounded-full ${
                  percentage >= 70
                    ? "bg-green-500"
                    : percentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Question Review</h2>
            <div className="space-y-4">
              {quizQuestions.map((question) => {
                const isCorrect = quizResult.correctAnswers.includes(
                  question.id
                );
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <div
                        className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                          isCorrect
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isCorrect ? <FaCheck /> : <FaTimes />}
                      </div>
                      <div>
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Your answer:</span>{" "}
                          {question.options[selectedOption || 0]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            <span className="font-medium">Correct answer:</span>{" "}
                            {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {quizResult.score < 50 ? (
              <div className="mt-8">
                <p className="text-red-600 text-lg font-medium mb-4">
                  You didn't pass this time. Here are some recommended courses
                  to help you improve:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {/* Recommended Course 1 */}
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="React Fundamentals"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        React Fundamentals
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Master the core concepts of React including components,
                        state, and props.
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Beginner
                        </span>
                        <span className="text-sm text-gray-500">4.7 ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Course 2 */}
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1581279430938-9b15690f9c9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="JavaScript Deep Dive"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        JavaScript Deep Dive
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Understand JavaScript fundamentals that power React and
                        modern web development.
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Beginner
                        </span>
                        <span className="text-sm text-gray-500">4.8 ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Course 3 */}
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                      alt="Web Development Basics"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        Web Development Basics
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Learn the fundamentals of HTML, CSS, and JavaScript for
                        modern web development.
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Beginner
                        </span>
                        <span className="text-sm text-gray-500">4.6 ★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium flex items-center">
                  <FaCheck className="mr-2" />
                  Congratulations! You passed the quiz with a score of{" "}
                  {Math.round(
                    (quizResult.score / quizResult.totalQuestions) * 100
                  )}
                  %.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Course
            </button>
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quiz</h1>
          <div className="text-gray-600">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${
                  (currentQuestionIndex / quizQuestions.length) * 100
                }%`,
              }}
            ></div>
          </div>

          <h2 className="text-xl font-medium text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className={`px-6 py-2 rounded-md flex items-center ${
              selectedOption === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {currentQuestionIndex === quizQuestions.length - 1
              ? "Finish"
              : "Next"}
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;
