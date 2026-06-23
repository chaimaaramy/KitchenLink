// src/profile/PublicProfileView.tsx
// Affiche le profil public d'un chef en lisant son id depuis l'URL (:chefId)
// et en récupérant ses données depuis le backend via GET /api/search

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Chef {
  id: string
  name: string
  email: string
  specialite: string
  restaurant: string
  ville: string
  experience: string
  bio: string
  photo: string
  badge: string
  followers: string[]
  following: string[]
}

export default function PublicProfileView() {
  const navigate = useNavigate()
  const { chefId } = useParams<{ chefId: string }>()

  const [chef, setChef] = useState<Chef | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowed, setIsFollowed] = useState(false)

  // Récupère le chef depuis le backend par son id
  useEffect(() => {
    const fetchChef = async () => {
      setLoading(true)
      try {
        // On charge tous les chefs et on filtre par id
        // (le backend n'a pas de route GET /api/users/:id donc on passe par search)
        const res = await fetch("http://localhost:5000/api/search")
        const data = await res.json()

        if (Array.isArray(data.chefs)) {
          const found = data.chefs.find(
            (u: any) => String(u.id) === String(chefId)
          )
          if (found) {
            setChef({
              id: String(found.id),
              name: found.name || "",
              email: found.email || "",
              specialite: found.specialite || "",
              restaurant: found.restaurant || "",
              ville: found.ville || "",
              experience: found.experience || "",
              bio: found.bio || "",
              photo: found.photo || "",
              badge: found.badge || "Junior",
              followers: Array.isArray(found.followers) ? found.followers : [],
              following: Array.isArray(found.following) ? found.following : [],
            })

            // Vérifie si l'utilisateur connecté suit déjà ce chef
            const storedUser = localStorage.getItem("chef")
            if (storedUser) {
              const currentUser = JSON.parse(storedUser)
              const currentId = String(currentUser.id)
              const followersIds = Array.isArray(found.followers)
                ? found.followers.map((id: any) => String(id))
                : []
              setIsFollowed(followersIds.includes(currentId))
            }
          }
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error)
      } finally {
        setLoading(false)
      }
    }

    if (chefId) fetchChef()
  }, [chefId])

  const handleFollow = async () => {
    const storedUser = localStorage.getItem("chef")
    if (!storedUser || !chef) return
    const currentUser = JSON.parse(storedUser)

    const route = isFollowed ? "unfollow" : "follow"
    try {
      await fetch(`http://localhost:5000/api/${route}/${chef.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerEmail: currentUser.email }),
      })
      setIsFollowed(!isFollowed)
    } catch (error) {
      console.error("Erreur follow/unfollow:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    )
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-gray-500">Chef introuvable.</p>
      </div>
    )
  }

  // Initiales pour l'avatar si pas de photo
  const initials = chef.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1A1A2E] hover:text-[#C49A3C] transition text-xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Profil du chef</h1>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden shadow-sm">

          <div className="h-32 bg-gradient-to-r from-[#C49A3C] to-[#1A1A2E]" />

          <div className="p-8 space-y-6">

            <div className="relative -mt-20 mb-8">
              <div className="flex items-end gap-5 mb-4">

                {/* Avatar : photo ou initiales */}
                <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C49A3C] flex items-center justify-center shadow-md overflow-hidden">
                  {chef.photo ? (
                    <img src={chef.photo} alt={chef.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <h2 className="text-3xl font-bold text-[#1A1A2E]">{chef.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#C49A3C] text-sm font-medium">
                      🏅 {chef.badge}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({chef.followers.length} followers)
                    </span>
                  </div>
                </div>
              </div>

              <div className="inline-block bg-[#F5F0E8] px-4 py-2 rounded-full border border-[#e0d8cc]">
                <p className="text-xs uppercase font-semibold text-[#1A1A2E] tracking-wide">
                  🍽️ {chef.specialite}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Infos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Restaurant</p>
                <p className="text-lg font-semibold text-[#1A1A2E]">{chef.restaurant || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ville</p>
                <p className="text-lg font-semibold text-[#1A1A2E]">{chef.ville || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Expérience</p>
                <p className="text-lg font-semibold text-[#1A1A2E]">
                  {chef.experience ? `${chef.experience} ans` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email</p>
                <p className="text-sm font-medium text-[#C49A3C] truncate">{chef.email}</p>
              </div>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Bio */}
            {chef.bio && (
              <>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">À propos</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{chef.bio}</p>
                </div>
                <div className="h-px bg-[#e0d8cc]" />
              </>
            )}

            {/* Boutons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleFollow}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                  isFollowed
                    ? "bg-[#e0d8cc] text-[#1A1A2E] hover:bg-gray-300"
                    : "border border-[#C49A3C] text-[#C49A3C] hover:bg-[#F5F0E8]"
                }`}
              >
                {isFollowed ? "✓ Suivi" : "+ Suivre"}
              </button>
              <button
                onClick={() => navigate(`/messages`)}
                className="flex-1 py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl text-sm font-medium hover:bg-[#2a2a4e] transition"
              >
                💬 Contacter
              </button>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-[#e0d8cc] p-4 text-center">
            <p className="text-2xl font-bold text-[#1A1A2E]">{chef.followers.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Followers</p>
          </div>
          <div className="bg-white rounded-xl border border-[#e0d8cc] p-4 text-center">
            <p className="text-2xl font-bold text-[#1A1A2E]">{chef.following.length}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Abonnements</p>
          </div>
        </div>

      </div>
    </div>
  )
}
