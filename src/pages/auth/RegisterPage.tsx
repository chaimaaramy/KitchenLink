// src/pages/auth/RegisterPage.tsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    specialite: "",
    restaurant: "",
    ville: "",
    experience: "",
    bio: "",
  })

  const [certifFile, setCertifFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nouveau chef :", form)
    console.log("Certification PDF :", certifFile)
    navigate("/profile")
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg border border-[#e0d8cc]">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#1A1A2E] tracking-widest">ChefLink</h1>
          <div className="w-10 h-1 bg-[#C49A3C] mx-auto my-2 rounded-full" />
          <p className="text-xs text-[#C49A3C] tracking-widest uppercase">
            Créer votre profil Chef
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

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
                placeholder="Jean"
                required
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
                placeholder="Dupont"
                required
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
              placeholder="chef@restaurant.com"
              required
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
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
              required
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            >
              <option value="">Choisir une spécialité</option>
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
                placeholder="Le Gourmet"
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
                placeholder="Casablanca"
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
            </div>
          </div>

          {/* Années d'expérience */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Années d'expérience
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="5"
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
              <p className="text-xs text-[#C49A3C] mt-1">
                ✅ Fichier sélectionné : {certifFile.name}
              </p>
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
              placeholder="Parlez-nous de votre parcours culinaire..."
              rows={3}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl font-medium text-sm tracking-wide hover:bg-[#2a2a4e] transition"
          >
            Créer mon profil
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#C49A3C] font-medium cursor-pointer hover:underline"
          >
            Se connecter
          </span>
        </p>

      </div>
    </div>
  )
}