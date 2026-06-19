// src/pages/ExplorePage.tsx
// Page "Explorer" : suggère des chefs à découvrir via le backend.
// Elle récupère la liste des chefs depuis l'API et filtre les résultats
import { useEffect, useState } from "react";
import ChefCard from "../components/ChefCard";

type Chef = {
  id: string;
  name: string;
  specialty: string;
  restaurant: string;
  city: string;
  avatar: string;
  bio: string;
  followers: string[];
  following: string[];
  email?: string;
};

export default function ExplorePage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/search");
        const data = await res.json();
        if (Array.isArray(data.chefs)) {
          setChefs(
            data.chefs.map((user: any) => ({
              id: String(user.id),
              name: user.name || "",
              specialty: user.specialite || "",
              restaurant: user.restaurant || "",
              city: user.ville || "",
              avatar: user.photo || "https://i.pravatar.cc/150?img=47",
              bio: user.bio || "",
              followers: Array.isArray(user.followers) ? user.followers : [],
              following: Array.isArray(user.following) ? user.following : [],
              email: user.email || "",
            })),
          );
        }
      } catch (error) {
        console.error("Erreur chargement chefs Explorer :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const storedUser = localStorage.getItem("chef");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = currentUser ? String(currentUser.id) : "";
  const currentUserEmail = currentUser ? currentUser.email : "";
  const currentFollowing = Array.isArray(currentUser?.following)
    ? currentUser.following.map((id: any) => String(id))
    : [];

  const suggestions = chefs.filter((chef) => {
    if (!chef.email || chef.email === currentUserEmail) return false;
    if (currentFollowing.includes(String(chef.id))) return false;

    return true;
  });

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Explorer</h1>
      <p className="text-gray-500 mb-6">Découvre des chefs que tu ne suis pas encore.</p>

      {loading ? (
        <p className="text-gray-500 text-center mt-10">Chargement...</p>
      ) : suggestions.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Aucun chef à suggérer pour l'instant.
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