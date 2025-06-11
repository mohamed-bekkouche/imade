import React from "react";
import {
  FaCheckCircle,
  FaClock,
  FaStar,
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  image: string;
  instructor: string;
}

const Recommend: React.FC = () => {
  const navigate = useNavigate();

  // Get form data from location state if available

  // Sample recommended courses (in a real app, these would come from an API)
  const recommendedCourses: Course[] = [
    {
      id: "1",
      title: "Advanced React Development",
      description:
        "Master advanced React patterns, hooks, and performance optimization techniques.",
      category: "Web Development",
      level: "Advanced",
      duration: "8 hours",
      rating: 4.8,
      students: 1245,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      instructor: "Sarah Johnson",
    },
    {
      id: "2",
      title: "State Management with Redux",
      description:
        "Learn how to manage complex state in your React applications using Redux.",
      category: "Web Development",
      level: "Intermediate",
      duration: "6 hours",
      rating: 4.6,
      students: 987,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      instructor: "Michael Chen",
    },
    {
      id: "3",
      title: "Full Stack JavaScript",
      description:
        "Build full-stack applications with Node.js, Express, React, and MongoDB.",
      category: "Full Stack",
      level: "Intermediate",
      duration: "12 hours",
      rating: 4.7,
      students: 2156,
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      instructor: "David Wilson",
    },
    {
      id: "4",
      title: "Responsive Web Design",
      description:
        "Create beautiful, responsive websites that work on any device.",
      category: "Web Design",
      level: "Beginner",
      duration: "5 hours",
      rating: 4.5,
      students: 3421,
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f9d0631?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80",
      instructor: "Emily Rodriguez",
    },
    {
      id: "5",
      title: "TypeScript Fundamentals",
      description:
        "Learn TypeScript to build more robust and maintainable JavaScript applications.",
      category: "Programming",
      level: "Intermediate",
      duration: "7 hours",
      rating: 4.7,
      students: 1789,
      image:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80",
      instructor: "Robert Taylor",
    },
    {
      id: "6",
      title: "GraphQL API Development",
      description:
        "Build flexible and efficient APIs with GraphQL and Node.js.",
      category: "Backend",
      level: "Advanced",
      duration: "6 hours",
      rating: 4.8,
      students: 932,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      instructor: "Jennifer Lee",
    },
  ];

  // Function to render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={`${
            i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
          } inline-block`}
        />
      ));
  };

  // Function to get level badge color
  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Thank You for Your Preferences!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've analyzed your learning style and preferences. Here are some
            courses we think you'll love!
          </p>
        </div>

        {/* Recommended Courses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FaBook className="text-blue-500 mr-2" />
            Recommended Just For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getLevelBadgeColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </span>
                    <div className="flex items-center">
                      {renderStars(course.rating)}
                      <span className="ml-1 text-sm text-gray-600">
                        ({course.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">
                      {course.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {course.instructor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Recommendations */}
        <div className="bg-blue-50 rounded-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaChalkboardTeacher className="text-blue-500 mr-2" />
            Personalized Learning Path
          </h2>
          <p className="text-gray-700 mb-4">
            Based on your preferences, we recommend starting with{" "}
            <span className="font-semibold">Advanced React Development</span> to
            build a strong foundation before moving on to more complex topics
            like state management and API development.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              React
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              JavaScript
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Web Development
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Frontend
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ready to start learning?
          </h3>
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommend;
