// src/pages/SearchPage.tsx
// Page de recherche de chefs par nom, spécialité, ville ou restaurant.
// Elle filtre la liste mockée de chefs en temps réel selon les critères saisis.

import { useState } from "react";
import { chefsMock } from "../data/chefsMock";
import ChefCard from "../components/ChefCard";


export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [restaurant, setRestaurant] = useState("");

  // Filtrage en temps réel : on compare chaque champ en minuscule pour ignorer la casse
  const results = chefsMock.filter((chef) => {
    const matchQuery =
      query === "" ||
      chef.name.toLowerCase().includes(query.toLowerCase());
    const matchSpecialty =
      specialty === "" ||
      chef.specialty.toLowerCase().includes(specialty.toLowerCase());
    const matchCity =
      city === "" ||
      chef.city.toLowerCase().includes(city.toLowerCase());
    const matchRestaurant =
      restaurant === "" ||
      chef.restaurant.toLowerCase().includes(restaurant.toLowerCase());
    return matchQuery && matchSpecialty && matchCity && matchRestaurant;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Rechercher des chefs
      </h1>

      {/* Barre de recherche principale */}
      <input
        type="text"
        placeholder="Nom du chef..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* Filtres secondaires côte à côte */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <input
          type="text"
          placeholder="Spécialité (ex: Pâtisserie)"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text"
          placeholder="Ville (ex: Paris)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text"
          placeholder="Restaurant"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Résultats */}
      {results.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Aucun chef trouvé. Essaie d'autres mots-clés.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}
