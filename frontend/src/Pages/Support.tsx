import React from "react";

const Support: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
        <p className="text-xl text-gray-600">
          Nous sommes là pour vous aider. Contactez notre équipe de support pour toute question ou assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comment nous contacter</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Support par Email</h3>
              <p className="text-gray-600">support@optilearn.com</p>
              <p className="text-sm text-gray-500 mt-1">Réponse sous 24 heures</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Téléphone</h3>
              <p className="text-gray-600">+33 1 23 45 67 89</p>
              <p className="text-sm text-gray-500 mt-1">Lundi - Vendredi, 9h - 18h</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
              <p className="text-gray-600">
                Consultez notre <a href="/faq" className="text-blue-600 hover:text-blue-800">FAQ</a> pour des réponses rapides aux questions courantes.
              </p>
            </div>
          </div>
        </div>

        {/* Support Form */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Formulaire de Support</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom Complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <select
                id="subject"
                name="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="technical">Problème technique</option>
                <option value="account">Problème de compte</option>
                <option value="billing">Question de facturation</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Envoyer la Demande
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support; 