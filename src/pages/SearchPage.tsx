// src/pages/SearchPage.tsx
// Page de recherche de chefs par nom, spécialité, ville ou restaurant.
// Connectée au backend via GET /api/search

import { useState, useEffect } from "react";
import ChefCard from "../components/ChefCard";
import type { Chef } from "../data/chefsMock"; // ← on importe le type officiel

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [results, setResults] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (specialty) params.append("specialite", specialty);
        if (city) params.append("ville", city);
        if (restaurant) params.append("restaurant", restaurant);

        const res = await fetch(
          `http://localhost:5000/api/search?${params.toString()}`
        );
        const data = await res.json();

        if (Array.isArray(data.chefs)) {
          // On mappe la réponse backend vers le type Chef de chefsMock
          // Le backend utilise "specialite" et "ville", le type Chef utilise "specialty" et "city"
          const mapped: Chef[] = data.chefs.map((user: any) => ({
            id: String(user.id),
            name: user.name || "",
            specialty: user.specialite || "",   // ← renommage backend → frontend
            restaurant: user.restaurant || "",
            city: user.ville || "",              // ← renommage backend → frontend
            avatar: user.photo || "https://i.pravatar.cc/150?img=47",
            bio: user.bio || "",
            email: user.email || "",             // ← présent dans l'interface Chef
            followers: Array.isArray(user.followers) ? user.followers : [],
            following: Array.isArray(user.following) ? user.following : [],
          }));
          setResults(mapped);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Erreur recherche chefs :", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, [query, specialty, city, restaurant]);

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

      {/* Filtres secondaires */}
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
      {loading ? (
        <p className="text-gray-500 text-center mt-10">Recherche en cours...</p>
      ) : results.length === 0 ? (
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
