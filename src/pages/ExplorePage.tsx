// src/pages/ExplorePage.tsx
// Page "Explorer" : suggère des chefs à découvrir que l'utilisateur ne suit pas encore.
// Elle imite une logique de recommandation simple basée sur la spécialité.

import ChefCard from "../components/ChefCard";
import { chefsMock } from "../data/chefsMock";

export default function ExplorePage() {
  // Simulation : on considère que l'utilisateur courant a l'id "1"
  // et suit déjà les chefs dont followedIds contient son id
  const currentUserId = "1";

  // On filtre les chefs que l'utilisateur ne suit pas (et qui ne sont pas lui-même)
  const suggestions = chefsMock.filter(
    (chef) =>
      chef.id !== currentUserId &&
      !chef.followers.includes(currentUserId)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Explorer</h1>
      <p className="text-gray-500 mb-6">
        Découvre des chefs que tu ne suis pas encore.
      </p>

      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Tu suis déjà tout le monde ! Reviens bientôt.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}
