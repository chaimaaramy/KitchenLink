// src/components/ChatWindow.tsx
// Fenêtre de chat connectée au backend via http://localhost:5000/api/messages
// Utilise chef.email (maintenant présent dans l'interface Chef de chefsMock.ts)

import { useState, useRef, useEffect } from "react"
import type { Chef } from "../data/chefsMock"

interface Message {
  id: string
  senderId: string  // "me" = message envoyé par l'utilisateur connecté
  text: string
  time: string
}

interface Props {
  chef: Chef
  onClose?: () => void
}

// Récupère l'utilisateur connecté depuis localStorage
function getCurrentUser() {
  try {
    const stored = localStorage.getItem("chef")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function ChatWindow({ chef, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loadingMessages, setLoadingMessages] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Chargement des messages depuis le backend au montage
  // et à chaque changement de chef (si on ouvre une autre conversation)
  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true)
      const currentUser = getCurrentUser()

      // Si pas d'utilisateur connecté ou pas d'email sur le chef, on vide
      if (!currentUser?.email || !chef.email) {
        setMessages([])
        setLoadingMessages(false)
        return
      }

      try {
        const params = new URLSearchParams({
          userEmail: currentUser.email,
          chefEmail: chef.email,   // chef.email existe maintenant dans l'interface
        })

        const response = await fetch(
          `http://localhost:5000/api/messages?${params.toString()}`
        )
        const data = await response.json()

        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg: any) => ({
              id: String(msg.id),
              // Si le message vient de moi → senderId = "me"
              // Sinon → senderId = id du chef pour différencier côté affichage
              senderId: msg.fromEmail === currentUser.email ? "me" : chef.id,
              text: msg.content || "",
              time: msg.createdAt || "",
            }))
          )
        } else {
          setMessages([])
        }
      } catch (error) {
        console.error("Erreur chargement messages:", error)
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    fetchMessages()
  }, [chef.email, chef.id])

  // Scroll automatique vers le dernier message à chaque mise à jour
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    const currentUser = getCurrentUser()
    if (!currentUser?.email) return

    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`

    // On vide l'input immédiatement pour une meilleure UX
    setInput("")

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail: currentUser.email,
          toEmail: chef.email,   // chef.email existe maintenant
          content: text,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Erreur envoi:", data.error)
        return
      }

      // Ajoute le message envoyé dans la liste locale (pas besoin de re-fetch)
      setMessages((prev) => [
        ...prev,
        {
          id: String(data.data?.id || Date.now()),
          senderId: "me",
          text,
          time,
        },
      ])

    } catch (error) {
      console.error("Erreur envoi message:", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* En-tête */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <img
          src={chef.avatar}
          alt={chef.name}
          className="w-9 h-9 rounded-full object-cover border border-orange-200"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">{chef.name}</p>
          <p className="text-xs text-gray-400">{chef.specialty}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Corps : messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">

        {/* Indicateur de chargement */}
        {loadingMessages && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Chargement des messages...
          </p>
        )}

        {/* Aucun message */}
        {!loadingMessages && messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Aucun message pour l'instant. Commence la conversation !
          </p>
        )}

        {/* Liste des messages */}
        {messages.map((msg) => {
          const isMe = msg.senderId === "me"
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          )
        })}

        {/* Ancre invisible pour le scroll automatique */}
        <div ref={bottomRef} />
      </div>

      {/* Zone de saisie */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white">
        <input
          type="text"
          placeholder="Écrire un message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 disabled:opacity-40 transition-colors"
        >
          Envoyer
        </button>
      </div>

    </div>
  )
}
