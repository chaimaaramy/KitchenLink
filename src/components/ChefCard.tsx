// src/components/ChefCard.tsx
// Carte affichant le résumé d'un chef : photo, nom, spécialité, ville et bouton Follow.
// Utilisée dans SearchPage, ExplorePage et ConnectionsList.

import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import type { Chef } from "../data/chefsMock";

interface Props {
  chef: Chef;
}

export default function ChefCard({ chef }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      {/* Photo de profil */}
      <img
        src={chef.avatar}
        alt={chef.name}
        onClick={() => navigate(`/public-profile/${chef.id}`)}
        className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-orange-300 mb-3"
      />

      {/* Infos */}
      <h3
        className="font-semibold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors"
        onClick={() => navigate(`/public-profile/${chef.id}`)}
      >
        {chef.name}
      </h3>
      <p className="text-sm text-orange-500 font-medium">{chef.specialty}</p>
      <p className="text-sm text-gray-400 mb-1">{chef.restaurant}</p>
      <p className="text-xs text-gray-400 mb-4">📍 {chef.city}</p>

      {/* Statistiques abonnés */}
      <p className="text-xs text-gray-500 mb-3">
        {chef.followers.length} abonné{chef.followers.length > 1 ? "s" : ""}
      </p>

      {/* Bouton suivre */}
      <FollowButton chefId={chef.id} />
    </div>
  );
}
