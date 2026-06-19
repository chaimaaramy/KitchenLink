// src/pages/auth/LoginPage.tsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")        // ← message d'erreur affiché à l'utilisateur
  const [loading, setLoading] = useState(false) // ← désactive le bouton pendant la requête
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")       // réinitialise l'erreur à chaque tentative
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      // Si le serveur répond avec une erreur (401, 400...)
      // data.error contient le message envoyé par api.js
      // ex: "Email ou password incorrect"
      if (!response.ok) {
        setError(data.error || "Erreur de connexion. Vérifie tes identifiants.")
        setLoading(false)
        return
      }

      // Connexion réussie : on sauvegarde l'utilisateur dans localStorage
      if (data.user) {
        localStorage.setItem('chef', JSON.stringify(data.user))
        localStorage.setItem('userId', String(data.user.id))
        navigate('/feed')
      }

    } catch (err) {
      // Ce bloc se déclenche UNIQUEMENT si le backend est éteint
      // ou si le réseau est coupé (Failed to fetch)
      setError("Impossible de contacter le serveur. Vérifie que le backend est lancé sur le port 5000.")
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md border border-[#e0d8cc]">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#1A1A2E] tracking-widest">ChefLink</h1>
          <div className="w-10 h-1 bg-[#C49A3C] mx-auto my-2 rounded-full" />
          <p className="text-xs text-[#C49A3C] tracking-widest uppercase">
            Réseau des Chefs Professionnels
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chef@restaurant.com"
              required
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-[#e0d8cc] rounded-xl text-sm bg-[#FAFAF8] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          {/* Message d'erreur — visible uniquement si error n'est pas vide */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl font-medium text-sm tracking-wide hover:bg-[#2a2a4e] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Pas encore de compte ?{" "}
          <span
            onClick={() => navigate("/RegisterPage")}
            className="text-[#C49A3C] font-medium cursor-pointer hover:underline"
          >
            Créer un compte
          </span>
        </p>

      </div>
    </div>
  )
}
