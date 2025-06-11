import {
  FaLightbulb,
  FaGraduationCap,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Fondatrice & PDG",
      bio: "Scientifique cognitive avec plus de 15 ans d'expérience dans la recherche sur la mémoire et l'optimisation de l'apprentissage.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
    },
    {
      name: "Michael Chen",
      role: "Responsable de l'Éducation",
      bio: "Ancien professeur d'université spécialisé dans les méthodologies d'apprentissage et la réussite étudiante.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
    {
      name: "Emily Parker",
      role: "Conceptrice d'Expériences d'Apprentissage",
      bio: "Experte dans la création d'expériences d'apprentissage engageantes et efficaces pour divers publics.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          À propos d'OptiLearn
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Donner aux apprenants du monde entier les moyens d'utiliser des
          techniques de mémoire et des stratégies d'apprentissage éprouvées
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-blue-50 rounded-2xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Notre Mission
          </h2>
          <p className="text-gray-600 text-lg">
            Chez OptiLearn, nous nous consacrons à révolutionner la façon dont
            les gens apprennent et retiennent l'information. Notre mission est
            de rendre les techniques de mémoire avancées et les stratégies
            d'apprentissage accessibles à tous, aidant les étudiants, les
            professionnels et les apprenants tout au long de la vie à atteindre
            leur plein potentiel.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaLightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Innovation
          </h3>
          <p className="text-gray-600">
            Nous développons constamment de nouvelles méthodes d'apprentissage
            basées sur les dernières recherches en sciences cognitives.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaGraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Excellence
          </h3>
          <p className="text-gray-600">
            Nous nous engageons à fournir des contenus de la plus haute qualité,
            créés par des experts dans leurs domaines.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaUsers className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Communauté
          </h3>
          <p className="text-gray-600">
            Nous croyons en la puissance de l'apprentissage collaboratif et en
            la création d'une communauté d'apprenants engagés.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaChartLine className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Progrès</h3>
          <p className="text-gray-600">
            Nous mesurons et suivons les progrès de nos apprenants pour garantir
            des résultats tangibles et durables.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Notre Équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-blue-50 rounded-2xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Notre Impact
          </h2>
          <p className="text-gray-600 text-lg">
            Depuis notre lancement, nous avons aidé des milliers d'apprenants à
            améliorer leurs compétences d'apprentissage, à augmenter leur
            confiance et à atteindre leurs objectifs académiques et
            professionnels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
