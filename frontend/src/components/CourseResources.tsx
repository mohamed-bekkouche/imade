import React from "react";

interface ResourceLink {
  title: string;
  link: string;
  description: string;
}

export interface CourseResources {
  title: string;
  description: string;
  youtubeLinks: ResourceLink[];
  courseLinks: ResourceLink[];
}

interface Props {
  resources: CourseResources;
}

const CourseResourcesRenderer: React.FC<Props> = ({ resources }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{resources.title}</h1>
      <p className="text-lg text-gray-700 mb-8">{resources.description}</p>

      {(resources.youtubeLinks.length > 0 ||
        resources.courseLinks.length > 0) && (
        <div className="space-y-8">
          {resources.youtubeLinks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">YouTube Resources</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {resources.youtubeLinks.map((video, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2">
                      <a
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {video.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-3">{video.description}</p>
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                      Watch Video
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resources.courseLinks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Course Resources</h2>
              <div className="grid gap-4">
                {resources.courseLinks.map((course, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-2">
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {course.title}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700"
                    >
                      View Course
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseResourcesRenderer;
