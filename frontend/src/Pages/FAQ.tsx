import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce qu'OptiLearn ?",
      answer: "OptiLearn est une plateforme d'apprentissage en ligne qui se concentre sur l'amélioration de la mémoire et des techniques d'apprentissage. Nous proposons des cours basés sur des méthodes scientifiquement prouvées pour optimiser votre apprentissage et votre rétention d'information."
    },
    {
      question: "Comment fonctionnent les cours ?",
      answer: "Nos cours sont structurés en modules progressifs, combinant théorie et pratique. Chaque cours comprend des vidéos, des exercices pratiques, des quiz et des ressources complémentaires. Vous pouvez suivre les cours à votre propre rythme et accéder au contenu 24/7."
    },
    {
      question: "Quels sont les prérequis pour commencer ?",
      answer: "Il n'y a pas de prérequis spécifiques pour la plupart de nos cours. Certains cours avancés peuvent nécessiter des connaissances de base, mais nous proposons des cours pour tous les niveaux, des débutants aux apprenants expérimentés."
    },
    {
      question: "Comment puis-je accéder à mes cours ?",
      answer: "Une fois inscrit, vous pouvez accéder à vos cours depuis votre tableau de bord personnel. Vous pouvez suivre vos cours sur n'importe quel appareil (ordinateur, tablette ou smartphone) avec une connexion internet."
    },
    {
      question: "Quelle est la durée d'accès aux cours ?",
      answer: "L'accès aux cours est illimité une fois que vous vous êtes inscrit. Vous pouvez revoir le contenu autant de fois que vous le souhaitez et progresser à votre propre rythme."
    },
    {
      question: "Y a-t-il un certificat à la fin des cours ?",
      answer: "Oui, nous délivrons un certificat de complétion pour chaque cours terminé avec succès. Ces certificats peuvent être téléchargés et partagés sur votre profil professionnel."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les cartes de crédit, les virements bancaires et les paiements via PayPal. Toutes les transactions sont sécurisées et cryptées."
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer: "Oui, nous offrons une garantie de remboursement de 30 jours si vous n'êtes pas satisfait de votre expérience. Contactez notre service client pour plus de détails."
    },
    {
      question: "Comment puis-je contacter le support ?",
      answer: "Vous pouvez contacter notre équipe de support par email à support@optilearn.com, par téléphone au +33 1 23 45 67 89, ou via le formulaire de contact sur notre page de support."
    },
    {
      question: "Les cours sont-ils disponibles en plusieurs langues ?",
      answer: "Actuellement, nos cours sont disponibles en français. Nous prévoyons d'ajouter d'autres langues dans le futur."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">FAQ</h1>
        <p className="text-xl text-gray-600">
          Questions fréquemment posées sur OptiLearn
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Vous ne trouvez pas la réponse à votre question ?
        </p>
        <a
          href="/support"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Contactez notre support
        </a>
      </div>
    </div>
  );
};

export default FAQ; 