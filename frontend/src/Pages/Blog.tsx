import React from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Les Meilleures Techniques de Mémoire pour les Étudiants",
      excerpt: "Découvrez des techniques éprouvées pour améliorer votre mémoire et votre apprentissage.",
      date: "15 Mars 2024",
      category: "Mémoire",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title: "Comment Améliorer Votre Concentration",
      excerpt: "Apprenez des stratégies efficaces pour maintenir votre concentration pendant l'étude.",
      date: "10 Mars 2024",
      category: "Concentration",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 3,
      title: "Les Avantages de la Lecture Rapide",
      excerpt: "Explorez les bénéfices de la lecture rapide et comment l'appliquer à vos études.",
      date: "5 Mars 2024",
      category: "Lecture",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Découvrez nos articles sur l'apprentissage, la mémoire et les techniques d'étude.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-48 relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-2">{post.date}</div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <div className="mt-4">
                <span className="text-blue-600 hover:text-blue-800 font-medium">
                  Lire l'article →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog; 