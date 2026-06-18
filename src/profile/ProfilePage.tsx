// src/pages/profile/ProfilePage.tsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BadgeCard from "../components/BadgeCard"

type Chef = {
  prenom: string
  nom: string
  email: string
  specialite: string
  restaurant: string
  ville: string
  experience: number
  bio: string
  photo: string
  certification: string
  badge: "Junior" | "Confirmé" | "Étoilé"
}

export default function ProfilePage() {
  const navigate = useNavigate()

  const [chef] = useState<Chef>(() => {
  const stored = localStorage.getItem('chef');
  if (stored) {
    const data = JSON.parse(stored);
 
    const [prenom, ...nomParts] = data.name.split(' ');
    return {
      prenom,
      nom: nomParts.join(' ') || 'Unknown',
      email: data.email,
      specialite: data.specialite || '',
      restaurant: data.restaurant || '',
      ville: data.ville || '',
      experience: data.experience || 0,
      bio: data.bio || '',
      photo: data.photo || '',
      certification: data.certification || '',
      badge: data.badge || 'Junior'
    };
  }
  return {
    prenom: 'Guest',
    nom: 'User',
    email: '',
    specialite: '',
    restaurant: '',
    ville: '',
    experience: 0,
    bio: '',
    photo: '',
    certification: '',
    badge: 'Junior'
  };
});

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Carte principale */}
        <div className="bg-white rounded-2xl border border-[#e0d8cc] overflow-hidden">

          {/* Bannière */}
          <div className="h-28 bg-[#1A1A2E]" />

          {/* Info chef */}
          <div className="px-8 pb-8">

            {/* Photo de profil */}
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-[#C49A3C] flex items-center justify-center text-white text-3xl font-bold shadow">
                {chef.photo ? (
                  <img src={chef.photo} alt="profil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  `${chef.prenom[0]}${chef.nom[0]}`
                )}
              </div>

              {/* Bouton modifier */}
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-2 border border-[#1A1A2E] text-[#1A1A2E] rounded-xl text-sm font-medium hover:bg-[#1A1A2E] hover:text-white transition"
              >
                ✏️ Modifier
              </button>
            </div>

            {/* Nom + badge */}
            <div className="mb-1">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">
                {chef.prenom} {chef.nom}
              </h2>
              <p className="text-sm text-[#C49A3C] font-medium">{chef.specialite}</p>
            </div>

            <BadgeCard niveau={chef.badge} />

            {/* Infos */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {chef.restaurant && <p>🍽️ <span className="font-medium">{chef.restaurant}</span></p>}
              {chef.ville && <p>📍 <span className="font-medium">{chef.ville}</span></p>}
              {chef.experience > 0 && <p>⏱️ <span className="font-medium">{chef.experience} ans</span> d'expérience</p>}
              {chef.email && <p>✉️ {chef.email}</p>}
            </div>

            {/* Bio */}
            {chef.bio && (
              <div className="mt-5 p-4 bg-[#F5F0E8] rounded-xl">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-sm text-gray-700 leading-relaxed">{chef.bio}</p>
              </div>
            )}

          </div>
        </div>

        {/* Carte certification */}
        <div className="bg-white rounded-2xl border border-[#e0d8cc] px-8 py-6">
          <h3 className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wide mb-4">
            🎓 Certification
          </h3>
          {chef.certification ? (
            <div className="flex items-center gap-3 p-3 bg-[#F5F0E8] rounded-xl">
              <div className="w-10 h-10 bg-[#1A1A2E] rounded-lg flex items-center justify-center text-white text-lg">
                📄
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A2E]">{chef.certification}</p>
                <p className="text-xs text-gray-400">Document PDF</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Aucune certification ajoutée</p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/feed")}
            className="w-full py-3 rounded-xl bg-[#1A1A2E] text-[#F5F0E8] text-sm font-medium hover:bg-[#2a2a4e] transition"
          >
            Retour au feed
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-red-300 text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 transition"
          >
            Se déconnecter
          </button>
        </div>

      </div>
    </div>
  )
}