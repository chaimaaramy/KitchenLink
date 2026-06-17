// src/pages/ConnectionsList.tsx
// Page "Mes connexions" : affiche les chefs que l'utilisateur suit
// et ceux qui le suivent (abonnés), en deux onglets distincts.

import { useState, useEffect } from "react";
import ChefCard from "../components/ChefCard";
import { chefsMock } from "../data/chefsMock";

type Tab = "following" | "followers";

function getFollowingIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem("following") || "[]");
  } catch {
    return [];
  }
}

export default function ConnectionsList() {
  const [activeTab, setActiveTab] = useState<Tab>("following");
  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    setFollowingIds(getFollowingIds());
  }, []);

  // Chefs que l'utilisateur suit
  const following = chefsMock.filter((c) => followingIds.includes(c.id));

  // Abonnés simulés : chefs dont la liste followers contient l'id courant "1"
  const followers = chefsMock.filter((c) => c.followers.includes("1"));

  const displayed = activeTab === "following" ? following : followers;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mes connexions</h1>

      {/* Onglets */}
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

      {/* Liste */}
      {displayed.length === 0 ? (
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
