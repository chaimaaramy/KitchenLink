// src/pages/MessagingPage.tsx
// Page de messagerie : permet aux utilisateurs de discuter en direct avec les chefs.
// Elle récupère la liste des chefs depuis l'API et affiche les conversations disponibles.
// Lorsqu'un chef est sélectionné, la fenêtre de chat s'ouvre pour permettre l'échange de messages.
import { useState, useEffect } from "react";
import ChatWindow from "../components/ChatWindow";

type Chef = {
  id: string;
  name: string;
  email: string;
  specialty: string;
  restaurant: string;
  city: string;
  avatar: string;
  bio: string;
  followers: string[];
  following: string[];
};

export default function MessagingPage() {
  const [openChatId, setOpenChatId] = useState<string | null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/search");
        const data = await res.json();
        if (Array.isArray(data.chefs)) {
          setChefs(
            data.chefs.map((user: any) => ({
              id: String(user.id),
              name: user.name || "",
              email: user.email || "",
              specialty: user.specialite || "",
              restaurant: user.restaurant || "",
              city: user.ville || "",
              avatar: user.photo || "https://i.pravatar.cc/150?img=47",
              bio: user.bio || "",
              followers: Array.isArray(user.followers) ? user.followers : [],
              following: Array.isArray(user.following) ? user.following : [],
            })),
          );
        }
      } catch (error) {
        console.error("Erreur chargement chefs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const storedUser = localStorage.getItem("chef");
  const currentUserEmail = storedUser ? JSON.parse(storedUser).email : "";
  const conversations = chefs.filter((chef) => chef.email && chef.email !== currentUserEmail);
  const activeChef = conversations.find((c) => c.id === openChatId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-full sm:w-80 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        </div>

        <div className="p-4 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            Sélectionne un chef pour discuter en direct.
          </p>
        </div>

        <ul className="overflow-y-auto flex-1">
          {loading ? (
            <li className="px-4 py-3 text-sm text-gray-500">Chargement...</li>
          ) : conversations.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">Aucun chef trouvé.</li>
          ) : (
            conversations.map((chef) => (
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
            ))
          )}
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {activeChef ? (
          <ChatWindow chef={activeChef} onClose={() => setOpenChatId(null)} />
        ) : (
          <p className="text-gray-400 text-sm">Sélectionne une conversation pour commencer.</p>
        )}
      </div>
    </div>
  );
}
