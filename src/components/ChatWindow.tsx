// src/components/ChatWindow.tsx
// Fenêtre de chat pour la messagerie directe entre deux chefs.
// Les messages sont stockés dans le state local React (pas de backend).
// La structure simule une conversation avec des messages pré-remplis.

import { useState, useRef, useEffect } from "react";
import type { Chef } from "../data/chefsMock";

interface Message {
  id: string;
  senderId: string; // "me" ou l'id du chef
  text: string;
  time: string;
}

interface Props {
  chef: Chef;
  onClose?: () => void;
}

// Chat messages are loaded from the backend for persistence.

export default function ChatWindow({ chef, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const storedUser = localStorage.getItem("chef");
      const currentUserEmail = storedUser ? JSON.parse(storedUser).email : "";
      if (!currentUserEmail || !chef.email) {
        setMessages([]);
        return;
      }

      try {
        const params = new URLSearchParams({
          userEmail: currentUserEmail,
          chefEmail: chef.email,
        });
        const response = await fetch(`http://localhost:5000/api/messages?${params.toString()}`);
        const data = await response.json();
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((message: any) => ({
              id: String(message.id),
              senderId: message.fromEmail === currentUserEmail ? "me" : chef.id,
              text: message.content || "",
              time: message.createdAt || "",
            })),
          );
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Erreur récupération messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [chef.email, chef.id]);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    const storedUser = localStorage.getItem("chef");
    const currentUser = storedUser ? JSON.parse(storedUser) : {};

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail: currentUser.email || "",
          toEmail: chef.email || "",
          content: text,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible d'envoyer le message.");
      }

      setMessages((prev) => [
        ...prev,
        { id: String(data.data.id), senderId: "me", text, time },
      ]);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("notificationsUpdated"));
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
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
