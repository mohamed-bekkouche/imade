import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaCalendarAlt,
  FaClock,
  FaListAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import quizService from "../services/quizService";

interface Answer {
  [key: number]: string[];
}

interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  answers: Answer;
  score?: number;
  passed: boolean;
  attemptNumber: number;
  createdAt: string;
  updatedAt: string;
}

const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchQuizAttempt = async () => {
      try {
        const data = await quizService.getQuizAttmept(id);
        setQuizAttempt(data.quizAttempt);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch quiz attempt");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAttempt();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <div className="flex items-center">
            <FaTimesCircle className="mr-2" />
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!quizAttempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded max-w-md">
          <div className="flex items-center">
            <FaQuestionCircle className="mr-2" />
            Quiz attempt not found
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
            <FaListAlt className="inline mr-2 text-blue-500" />
            Quiz Attempt Details
          </h1>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              quizAttempt.passed
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {quizAttempt.passed ? (
              <>
                <FaCheckCircle className="mr-1" />
                Passed
              </>
            ) : (
              <>
                <FaTimesCircle className="mr-1" />
                Not Passed
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <span className="font-semibold mr-2">Attempt Number:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {quizAttempt.attemptNumber}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Score:</span>
            <span>
              {quizAttempt.score !== undefined ? quizAttempt.score : "N/A"}
            </span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span className="font-semibold mr-2">Date:</span>
            <span>{formatDate(quizAttempt.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="text-gray-500 mr-2" />
            <span className="font-semibold mr-2">Time:</span>
            <span>{formatTime(quizAttempt.createdAt)}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaQuestionCircle className="mr-2 text-blue-500" />
          Your Answers:
        </h2>

        {quizAttempt.answers && Object.keys(quizAttempt.answers).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(quizAttempt.answers).map(
              ([questionIndex, answers]) => (
                <div
                  key={questionIndex}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium mb-2">
                    Question {parseInt(questionIndex) + 1}:
                  </h3>
                  <div className="ml-4">
                    {answers.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {answers.map((answer, answerIndex) => (
                          <li key={answerIndex} className="text-gray-700">
                            {answer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No answer provided</p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No answers recorded for this attempt.
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <FaSync className="mr-2" />
            Refresh Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
