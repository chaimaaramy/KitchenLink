// src/pages/auth/LoginPage.jsx

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

 const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // backend plus tard
    navigate("/profile")
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

          <button
            type="submit"
            className="w-full py-3 bg-[#1A1A2E] text-[#F5F0E8] rounded-xl font-medium text-sm tracking-wide hover:bg-[#2a2a4e] transition"
          >
            Se connecter
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