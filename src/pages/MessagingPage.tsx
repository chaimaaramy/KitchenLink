// src/pages/MessagingPage.tsx
// Page de messagerie : liste toutes les conversations existantes (chefs avec qui
// l'utilisateur a échangé). Un clic ouvre la fenêtre de chat correspondante.

import { useState } from "react";
import { chefsMock } from "../data/chefsMock";
import ChatWindow from "../components/ChatWindow";

// Simulation : l'utilisateur courant a des conversations avec les chefs 2, 3 et 4
const conversationIds = ["2", "3", "4"];

export default function MessagingPage() {
  const [openChatId, setOpenChatId] = useState<string | null>(null);

  const conversations = chefsMock.filter((c) =>
    conversationIds.includes(c.id)
  );

  const activeChef = conversations.find((c) => c.id === openChatId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Panneau gauche : liste des conversations */}
      <div className="w-full sm:w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        </div>

        <ul className="overflow-y-auto flex-1">
          {conversations.map((chef) => (
            <li
              key={chef.id}
              onClick={() => setOpenChatId(chef.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-orange-50 transition-colors ${
                openChatId === chef.id ? "bg-orange-50" : ""
              }`}
            >
              <img
                src={chef.avatar}
                alt={chef.name}
                className="w-10 h-10 rounded-full object-cover border border-orange-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{chef.name}</p>
                <p className="text-xs text-gray-400 truncate">{chef.specialty}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panneau droit : fenêtre de chat */}
      <div className="flex-1 flex items-center justify-center">
        {activeChef ? (
          <ChatWindow chef={activeChef} onClose={() => setOpenChatId(null)} />
        ) : (
          <p className="text-gray-400 text-sm">
            Sélectionne une conversation pour commencer.
          </p>
        )}
      </div>
    </div>
  );
}
