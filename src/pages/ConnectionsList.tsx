// src/pages/ConnectionsList.tsx
import { useState, useEffect } from "react"
import ChefCard from "../components/ChefCard"
import type { Chef } from "../data/chefsMock"  // ← import du type officiel, fini le conflit

type Tab = "following" | "followers"

export default function ConnectionsList() {
  const [activeTab, setActiveTab] = useState<Tab>("following")
  const [chefs, setChefs] = useState<Chef[]>([])
  const [loading, setLoading] = useState(false)

  // Récupère l'utilisateur connecté une seule fois
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem("chef")
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  const currentUserId = currentUser ? String(currentUser.id) : ""
  const currentUserEmail = currentUser?.email || ""

  // Liste des ids que l'utilisateur connecté suit (stockée dans son profil localStorage)
  const currentFollowingIds: string[] = Array.isArray(currentUser?.following)
    ? currentUser.following.map((id: any) => String(id))
    : []

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:5000/api/search")
        const data = await res.json()
        if (Array.isArray(data.chefs)) {
          const mapped: Chef[] = data.chefs
            .filter((u: any) => String(u.id) !== currentUserId) // on s'exclut soi-même
            .map((u: any) => ({
              id: String(u.id),
              name: u.name || "",
              specialty: u.specialite || "",
              restaurant: u.restaurant || "",
              city: u.ville || "",
              avatar: u.photo || "https://i.pravatar.cc/150?img=47",
              bio: u.bio || "",
              email: u.email || "",
              followers: Array.isArray(u.followers)
                ? u.followers.map((id: any) => String(id))
                : [],
              following: Array.isArray(u.following)
                ? u.following.map((id: any) => String(id))
                : [],
            }))
          setChefs(mapped)
        }
      } catch (error) {
        console.error("Erreur chargement connexions :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchChefs()
  }, [])

  // Abonnements : chefs que MOI je suis
  // Un chef est dans "following" si son id est dans la liste following de l'utilisateur connecté
  const following = chefs.filter((chef) =>
    currentFollowingIds.includes(String(chef.id))
  )

  // Abonnés : chefs qui ME suivent
  // Un chef me suit si MON id est dans sa liste followers
  const followers = chefs.filter((chef) =>
    chef.followers.includes(currentUserId) ||
    chef.followers.includes(currentUserEmail)
  )

  const displayed = activeTab === "following" ? following : followers

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 p-6">
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
  )
}
