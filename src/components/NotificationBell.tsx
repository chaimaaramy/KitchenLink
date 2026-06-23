// src/components/NotificationBell.tsx

type NotificationData = {
  id: string
  type: "follow" | "like" | "comment" | "message"
  message: string
  time: string
  read: boolean
  link?: string  // ← lien de navigation ajouté
}

type Props = {
  notifications: NotificationData[]
  unreadCount: number
  open: boolean
  onToggle: () => void
  onNotificationClick?: (notif: NotificationData) => void  // ← nouveau prop
}

// Icône et couleur selon le type de notification
function notifIcon(type: NotificationData["type"]) {
  switch (type) {
    case "follow":  return "👤"
    case "like":    return "❤️"
    case "comment": return "💬"
    case "message": return "✉️"
    default:        return "🔔"
  }
}

export default function NotificationBell({
  notifications,
  unreadCount,
  open,
  onToggle,
  onNotificationClick,
}: Props) {
  return (
    <div className="relative">

      {/* Bouton cloche */}
      <button
        type="button"
        onClick={onToggle}
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-[#e0d8cc] bg-white text-xl text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#B91C1C] px-1.5 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panneau des notifications */}
      {open && (
        <div className="absolute right-0 z-20 mt-3 w-[320px] rounded-[2rem] border border-[#e0d8cc] bg-white shadow-xl">

          {/* En-tête */}
          <div className="rounded-t-[2rem] bg-[#F5F0E8] p-5">
            <h3 className="text-sm font-semibold text-[#1A1A2E]">Notifications</h3>
            <p className="mt-1 text-xs text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </div>

          {/* Liste */}
          <div className="max-h-80 divide-y divide-[#f1e9dc] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-5 text-sm text-gray-500 text-center">
                Aucune notification pour l'instant.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick?.(notif)}
                  className={`p-4 text-sm transition-colors ${
                    notif.link || onNotificationClick
                      ? "cursor-pointer hover:bg-[#faf6ef]"  // cliquable si lien présent
                      : ""
                  } ${!notif.read ? "bg-[#fdf9f3]" : ""}`}  // fond légèrement coloré si non lue
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Icône selon le type */}
                      <span className="text-base">{notifIcon(notif.type)}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#C49A3C] font-medium">
                        {notif.type === "follow" ? "Abonné"
                          : notif.type === "like" ? "Like"
                          : notif.type === "comment" ? "Commentaire"
                          : "Message"}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{notif.time}</span>
                  </div>

                  <p className={`mt-2 leading-snug ${
                    notif.read ? "text-gray-500" : "text-[#1A1A2E] font-medium"
                  }`}>
                    {notif.message}
                  </p>

                  {/* Indicateur "non lu" + hint de navigation */}
                  {!notif.read && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#C49A3C]" />
                      {notif.link && (
                        <span className="text-[11px] text-[#C49A3C]">Voir →</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pied : lien "Tout marquer comme lu" */}
          {notifications.some((n) => !n.read) && (
            <div className="p-3 text-center border-t border-[#f1e9dc] rounded-b-[2rem]">
              <button
                onClick={onToggle}
                className="text-xs text-[#C49A3C] hover:underline"
              >
                Fermer
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
