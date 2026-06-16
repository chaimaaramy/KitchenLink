type NotificationData = {
  id: string
  type: "follow" | "like" | "comment"
  message: string
  time: string
  read: boolean
}

type Props = {
  notifications: NotificationData[]
  unreadCount: number
  open: boolean
  onToggle: () => void
}

export default function NotificationBell({ notifications, unreadCount, open, onToggle }: Props) {
  return (
    <div className="relative">
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

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-[320px] rounded-[2rem] border border-[#e0d8cc] bg-white shadow-xl">
          <div className="rounded-[2rem] bg-[#F5F0E8] p-5">
            <h3 className="text-sm font-semibold text-[#1A1A2E]">Notifications</h3>
            <p className="mt-1 text-xs text-gray-500">Derniers événements de votre communauté.</p>
          </div>
          <div className="max-h-80 divide-y divide-[#f1e9dc] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-5 text-sm text-gray-500">Aucune notification.</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.24em] text-[#C49A3C]">
                      {notification.type}
                    </span>
                    <span className="text-[11px] text-gray-400">{notification.time}</span>
                  </div>
                  <p className={`mt-2 ${notification.read ? "text-gray-500" : "text-[#1A1A2E] font-medium"}`}>
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
