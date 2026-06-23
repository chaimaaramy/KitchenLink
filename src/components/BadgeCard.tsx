type Props = {
  niveau: "Junior" | "Confirmé" | "Étoilé"
}

export default function BadgeCard({ niveau }: Props) {
  const config = {
    Junior: {
      label: "Chef Junior",
      emoji: "🍳",
      bg: "bg-[#E8F4E8]",
      text: "text-[#2D6A2D]",
      border: "border-[#A8D5A8]",
      desc: "Moins de 3 ans d'expérience",
    },
    Confirmé: {
      label: "Chef Confirmé",
      emoji: "👨‍🍳",
      bg: "bg-[#FFF4E0]",
      text: "text-[#B8860B]",
      border: "border-[#C49A3C]",
      desc: "Entre 3 et 8 ans d'expérience",
    },
    Étoilé: {
      label: "Chef Étoilé",
      emoji: "⭐",
      bg: "bg-[#1A1A2E]",
      text: "text-[#C49A3C]",
      border: "border-[#C49A3C]",
      desc: "Plus de 8 ans d'expérience",
    },
  }

  const badge = config[niveau]

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border ${badge.bg} ${badge.border}`}>
      <span className="text-xl">{badge.emoji}</span>
      <div>
        <p className={`text-xs font-bold ${badge.text}`}>{badge.label}</p>
        <p className="text-xs text-gray-400">{badge.desc}</p>
      </div>
    </div>
  )
}