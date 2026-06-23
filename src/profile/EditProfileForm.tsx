// src/profile/EditProfileForm.tsx
// Photo de profil via URL externe (plus simple et compatible avec le backend)

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function EditProfileForm() {
  const navigate = useNavigate()

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("chef")
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  }

  const storedUser = getStoredUser()
  const fullName = storedUser?.name || ""
  const [prenom, ...nomParts] = fullName.trim().split(/\s+/)

  const [form, setForm] = useState({
    prenom: prenom || "",
    nom: nomParts.join(" ") || "",
    email: storedUser?.email || "",
    specialite: storedUser?.specialite || "",
    restaurant: storedUser?.restaurant || "",
    ville: storedUser?.ville || "",
    experience: String(storedUser?.experience || 0),
    bio: storedUser?.bio || "",
    photoUrl: storedUser?.photo || "",  // ← URL de la photo
  })

  const [certifFile, setCertifFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const currentUser = getStoredUser()

    const updatedUser = {
      ...currentUser,
      name: `${form.prenom} ${form.nom}`.trim(),
      email: form.email,
      specialite: form.specialite,
      restaurant: form.restaurant,
      ville: form.ville,
      experience: Number(form.experience) || 0,
      bio: form.bio,
      photo: form.photoUrl,  // ← URL directe
      certification: certifFile?.name || currentUser?.certification || "",
    }

    // 1. Sauvegarde localStorage immédiatement
    localStorage.setItem("chef", JSON.stringify(updatedUser))

    // 2. Sauvegarde backend
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedUser.name,
          specialite: updatedUser.specialite,
          restaurant: updatedUser.restaurant,
          ville: updatedUser.ville,
          experience: updatedUser.experience,
          bio: updatedUser.bio,
          photo: updatedUser.photo,
          certification: updatedUser.certification,
        }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        // Met à jour localStorage avec la réponse backend
        localStorage.setItem("chef", JSON.stringify({ ...updatedUser, ...data.user }))
      }
    } catch (err) {
      console.warn("Backend non disponible, sauvegarde locale uniquement.")
    }

    setSaving(false)
    navigate("/profile")
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/profile")} className="text-[#1A1A2E] hover:text-[#C49A3C] transition text-xl">←</button>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Modifier mon profil</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e0d8cc] p-8 space-y-5">

          {/* Photo de profil via URL */}
          <div className="flex items-center gap-5">

            {/* Aperçu de la photo */}
            <div className="w-20 h-20 rounded-full border-4 border-[#e0d8cc] bg-[#C49A3C] flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
              ) : (
                `${form.prenom?.[0] || ""}${form.nom?.[0] || ""}`
              )}
            </div>

            {/* Champ URL */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Photo de profil (URL)
              </label>
              <input
                type="url"
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
                placeholder="https://exemple.com/ma-photo.jpg"
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Colle un lien vers une image (Unsplash, Google Photos, Imgur...)
              </p>
            </div>
          </div>

          <div className="h-px bg-[#e0d8cc]" />

          {/* Prénom + Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Prénom</label>
              <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Nom</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Adresse email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
          </div>

          {/* Spécialité */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Spécialité culinaire</label>
            <select name="specialite" value={form.specialite} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]">
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
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Restaurant</label>
              <input type="text" name="restaurant" value={form.restaurant} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ville</label>
              <input type="text" name="ville" value={form.ville} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
            </div>
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Années d'expérience</label>
            <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" max="50"
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]" />
          </div>

          {/* Certification PDF */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Certification (PDF)</label>
            <input type="file" accept=".pdf"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) setCertifFile(file) }}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] cursor-pointer" />
            {certifFile && <p className="text-xs text-[#C49A3C] mt-1">✅ {certifFile.name}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C] resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/profile")}
              className="flex-1 py-3 border border-[#e0d8cc] text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl text-sm font-medium hover:bg-[#2a2a4e] transition disabled:opacity-50">
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
