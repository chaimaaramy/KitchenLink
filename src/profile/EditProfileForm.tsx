// src/pages/profile/EditProfileForm.tsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function EditProfileForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    prenom: "Jean",
    nom: "Dupont",
    email: "jean@chef.com",
    specialite: "Cuisine française",
    restaurant: "Le Gourmet",
    ville: "Casablanca",
    experience: "10",
    bio: "Chef passionné avec 10 ans d'expérience dans la gastronomie française.",
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [certifFile, setCertifFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // backend plus tard
    console.log("Profil mis à jour :", form)
    console.log("Nouvelle photo :", photo)
    console.log("Nouvelle certification :", certifFile)
    navigate("/profile")
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-[#1A1A2E] hover:text-[#C49A3C] transition text-xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Modifier mon profil</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#e0d8cc] p-8 space-y-5">

          {/* Photo de profil */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-4 border-[#e0d8cc] bg-[#C49A3C] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                `${form.prenom[0]}${form.nom[0]}`
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Photo de profil
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#1A1A2E] file:text-white file:text-xs file:cursor-pointer hover:file:bg-[#2a2a4e]"
              />
              {photo && (
                <p className="text-xs text-[#C49A3C] mt-1">✅ {photo.name}</p>
              )}
            </div>
          </div>

          <div className="h-px bg-[#e0d8cc]" />

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Prénom
              </label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Adresse email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          {/* Spécialité */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Spécialité culinaire
            </label>
            <select
              name="specialite"
              value={form.specialite}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            >
              <option>Cuisine française</option>
              <option>Cuisine italienne</option>
              <option>Cuisine marocaine</option>
              <option>Cuisine asiatique</option>
              <option>Pâtisserie</option>
              <option>Cuisine méditerranéenne</option>
              <option>Cuisine fusion</option>
            </select>
          </div>

          {/* Restaurant + Ville */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Restaurant
              </label>
              <input
                type="text"
                name="restaurant"
                value={form.restaurant}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Ville
              </label>
              <input
                type="text"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
            </div>
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Années d'expérience
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              max="50"
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          {/* Certification PDF */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Certification (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (file) setCertifFile(file)
              }}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C] cursor-pointer"
            />
            {certifFile && (
              <p className="text-xs text-[#C49A3C] mt-1">✅ {certifFile.name}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C] resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 py-3 border border-[#e0d8cc] text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl text-sm font-medium hover:bg-[#2a2a4e] transition"
            >
              Sauvegarder
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}