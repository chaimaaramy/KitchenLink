
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface Chef {
  prenom: string
  nom: string
  email: string
  specialite: string
  restaurant: string
  ville: string
  experience: string
  bio: string
  photo: string
  certifications: string[]
  rating: number
  followers: number
  followed: boolean
}

export default function PublicProfileView() {
  const navigate = useNavigate()
  const { chefId } = useParams<{ chefId: string }>()

  const [chefData] = useState<Chef>({
    prenom: "Jean",
    nom: "Dupont",
    email: "jean@chef.com",
    specialite: "Cuisine française",
    restaurant: "Le Gourmet",
    ville: "Casablanca",
    experience: "10",
    bio: "Chef passionné avec 10 ans d'expérience dans la gastronomie française. Spécialiste de la cuisine classique avec une touche de modernité.",
    photo: "JD",
    certifications: ["CAP Cuisine 2010", "Diplôme Michelin 2015"],
    rating: 4.8,
    followers: 1240,
    followed: false,
  })

  const [isFollowed, setIsFollowed] = useState<boolean>(chefData.followed)

  const handleFollow = (): void => {
    setIsFollowed(!isFollowed)
  }

  const handleContact = (): void => {
    navigate(`/message/${chefId}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1A1A2E] hover:text-[#C49A3C] transition text-xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Profil du chef</h1>
        </div>

        {/* Card Principale */}
        <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden shadow-sm">

          {/* Photo de couverture (dégradé) */}
          <div className="h-32 bg-gradient-to-r from-[#C49A3C] to-[#1A1A2E]" />

          <div className="p-8 space-y-6">

            {/* Section Photo + Infos Principales */}
            <div className="relative -mt-20 mb-8">
              <div className="flex items-end gap-5 mb-4">
                {/* Photo de profil */}
                <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C49A3C] flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {chefData.photo}
                </div>
                
                {/* Nom + Rating */}
                <div className="flex-1 pb-2">
                  <h2 className="text-3xl font-bold text-[#1A1A2E]">
                    {chefData.prenom} {chefData.nom}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#C49A3C] text-sm font-medium">
                      ⭐ {chefData.rating}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ({chefData.followers.toLocaleString()} followers)
                    </span>
                  </div>
                </div>
              </div>

              {/* Spécialité en vedette */}
              <div className="inline-block bg-[#F5F0E8] px-4 py-2 rounded-full border border-[#e0d8cc]">
                <p className="text-xs uppercase font-semibold text-[#1A1A2E] tracking-wide">
                  🍽️ {chefData.specialite}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Infos principales en grille */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Restaurant
                </p>
                <p className="text-lg font-semibold text-[#1A1A2E]">
                  {chefData.restaurant}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Ville
                </p>
                <p className="text-lg font-semibold text-[#1A1A2E]">
                  {chefData.ville}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Expérience
                </p>
                <p className="text-lg font-semibold text-[#1A1A2E]">
                  {chefData.experience} ans
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Email
                </p>
                <p className="text-sm font-medium text-[#C49A3C] truncate">
                  {chefData.email}
                </p>
              </div>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Bio */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                À propos
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {chefData.bio}
              </p>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Certifications */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                📜 Certifications
              </p>
              <div className="space-y-2">
                {chefData.certifications.map((cert: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-[#F5F0E8] rounded-lg border border-[#e0d8cc]"
                  >
                    <span className="text-[#C49A3C]">✓</span>
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#e0d8cc]" />

            {/* Boutons d'action */}
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
                onClick={handleContact}
                className="flex-1 py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl text-sm font-medium hover:bg-[#2a2a4e] transition"
              >
                💬 Contacter
              </button>
            </div>

          </div>
        </div>

        {/* Statistiques supplémentaires (optionnel) */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-[#e0d8cc] p-4 text-center">
            <p className="text-2xl font-bold text-[#C49A3C]">4.8</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Note
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#e0d8cc] p-4 text-center">
            <p className="text-2xl font-bold text-[#1A1A2E]">1.2K</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Followers
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#e0d8cc] p-4 text-center">
            <p className="text-2xl font-bold text-[#1A1A2E]">48</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              Recettes
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}