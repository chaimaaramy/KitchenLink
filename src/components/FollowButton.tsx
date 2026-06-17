// src/components/FollowButton.tsx
// Bouton Follow / Unfollow.
// Il lit et écrit dans le localStorage pour simuler une persistance locale
// sans backend. La clé utilisée est "following" et contient un tableau d'ids.

import { useState, useEffect } from "react";

interface Props {
  chefId: string;
}

// Helpers localStorage
function getFollowing(): string[] {
  try {
    return JSON.parse(localStorage.getItem("following") || "[]");
  } catch {
    return [];
  }
}

function saveFollowing(ids: string[]) {
  localStorage.setItem("following", JSON.stringify(ids));
}

export default function FollowButton({ chefId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Au montage, on vérifie si on suit déjà ce chef
  useEffect(() => {
    const following = getFollowing();
    setIsFollowing(following.includes(chefId));
  }, [chefId]);

  const toggle = () => {
    const following = getFollowing();
    let updated: string[];

    if (isFollowing) {
      // Unfollow : on retire l'id
      updated = following.filter((id) => id !== chefId);
    } else {
      // Follow : on ajoute l'id
      updated = [...following, chefId];
    }

    saveFollowing(updated);
    setIsFollowing(!isFollowing);
  };

  return (
    <button
      onClick={toggle}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isFollowing
          ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200"
          : "bg-orange-500 text-white hover:bg-orange-600"
      }`}
    >
      {isFollowing ? "Ne plus suivre" : "Suivre"}
    </button>
  );
}
