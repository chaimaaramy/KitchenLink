// src/pages/ConnectionsList.tsx
// Page "Mes connexions" : affiche les chefs que l'utilisateur suit
// et ceux qui le suivent (abonnés), en deux onglets distincts.

import { useState, useEffect } from "react";
import ChefCard from "../components/ChefCard";

type Tab = "following" | "followers";

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

export default function ConnectionsList() {
  const [activeTab, setActiveTab] = useState<Tab>("following");
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
        console.error("Erreur chargement connexions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const storedUser = localStorage.getItem("chef");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserEmail = currentUser ? currentUser.email : "";
  const currentUserId = currentUser ? String(currentUser.id) : "";
  const currentFollowing = Array.isArray(currentUser?.following)
    ? currentUser.following.map((id: any) => String(id))
    : [];

  const following = chefs.filter((chef) => currentFollowing.includes(String(chef.id)));
  const followers = chefs.filter((chef) => {
    const followsById = Array.isArray(chef.following)
      ? chef.following.map((id: any) => String(id)).includes(currentUserId)
      : false;
    const followsByEmail = Array.isArray(chef.followers)
      ? chef.followers.includes(currentUserEmail)
      : false;
    return chef.email !== currentUserEmail && (followsById || followsByEmail);
  });

  const displayed = activeTab === "following" ? following : followers;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes connexions</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("following")}
          className={`pb-2 font-medium text-sm transition-colors ${
            activeTab === "following"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Abonnements ({following.length})
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-2 font-medium text-sm transition-colors ${
            activeTab === "followers"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Abonnés ({followers.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center mt-10">Chargement...</p>
      ) : displayed.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          {activeTab === "following"
            ? "Tu ne suis personne pour l'instant. Explore des chefs !"
            : "Personne ne te suit encore."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayed.map((chef) => (
            <ChefCard key={chef.id} chef={chef} />
          ))}
        </div>
      )}
    </div>
  );
}
