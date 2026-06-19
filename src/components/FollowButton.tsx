// src/components/FollowButton.tsx
// Bouton Follow / Unfollow.
// Il lit et écrit dans le localStorage pour simuler une persistance locale
// sans backend. La clé utilisée est "following" et contient un tableau d'ids.
// Lorsqu'un utilisateur clique sur le bouton, il met à jour le localStorage et l'état du bouton.
import { useState, useEffect } from "react";

interface Props {
  chefId: string;
}

// Helpers localStorage
function getFollowing(): string[] {
  try {
    const storedFollowing = localStorage.getItem("following");
    if (storedFollowing) {
      return JSON.parse(storedFollowing);
    }

    const storedChef = localStorage.getItem("chef");
    if (storedChef) {
      const chef = JSON.parse(storedChef);
      if (Array.isArray(chef.following)) {
        return chef.following;
      }
    }

    return [];
  } catch {
    return [];
  }
}

function saveFollowing(ids: string[]) {
  localStorage.setItem("following", JSON.stringify(ids));

  const storedChef = localStorage.getItem("chef");
  if (storedChef) {
    try {
      const chef = JSON.parse(storedChef);
      chef.following = ids;
      localStorage.setItem("chef", JSON.stringify(chef));
    } catch {
      // ignore JSON parse error
    }
  }
}

export default function FollowButton({ chefId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Au montage, on vérifie si on suit déjà ce chef
  useEffect(() => {
    const following = getFollowing();
    setIsFollowing(following.includes(chefId));
  }, [chefId]);

  const toggle = async () => {
    const storedUser = localStorage.getItem('chef');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const following = getFollowing();
    let updated: string[];

    if (isFollowing) {
      try {
        if (currentUser?.email) {
          const response = await fetch(`http://localhost:5000/api/unfollow/${chefId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerEmail: currentUser.email }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Impossible de ne plus suivre le chef');
          }
          updated = following.filter((id) => id !== chefId);
        } else {
          updated = following.filter((id) => id !== chefId);
        }
      } catch (error) {
        console.error('Erreur unfollow:', error);
        return;
      }
    } else {
      try {
        if (currentUser?.email) {
          const response = await fetch(`http://localhost:5000/api/follow/${chefId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followerEmail: currentUser.email }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Impossible de suivre le chef');
          }
          updated = [...following, chefId];
        } else {
          updated = [...following, chefId];
        }
      } catch (error) {
        console.error('Erreur follow:', error);
        return;
      }
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
