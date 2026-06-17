// src/components/ChatWindow.tsx
// Fenêtre de chat pour la messagerie directe entre deux chefs.
// Les messages sont stockés dans le state local React (pas de backend).
// La structure simule une conversation avec des messages pré-remplis.

import { useState, useRef, useEffect } from "react";
import type { Chef } from "../data/chefsMock";

interface Message {
  id: number;
  senderId: string; // "me" ou l'id du chef
  text: string;
  time: string;
}

interface Props {
  chef: Chef;
  onClose?: () => void;
}

// Messages fictifs initiaux pour simuler une vraie conversation
function getInitialMessages(chefId: string): Message[] {
  return [
    {
      id: 1,
      senderId: chefId,
      text: "Bonjour ! Tu as vu la nouvelle recette que j'ai postée ?",
      time: "10:02",
    },
    {
      id: 2,
      senderId: "me",
      text: "Oui ! La présentation est magnifique. Quelle cuisson tu utilises ?",
      time: "10:05",
    },
    {
      id: 3,
      senderId: chefId,
      text: "Cuisson sous vide 48h puis saisie à feu vif 30 secondes.",
      time: "10:07",
    },
  ];
}

export default function ChatWindow({ chef, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(() =>
    getInitialMessages(chef.id)
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), senderId: "me", text, time },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
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
                <p
                  className={`text-xs mt-1 ${
                    isMe ? "text-orange-100" : "text-gray-400"
                  } text-right`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
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
  );
}
