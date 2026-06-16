type Props = {
  liked: boolean
  count: number
  onToggle: () => void
}

export default function LikeButton({ liked, count, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
        liked ? "bg-[#FFE6E6] text-[#B91C1C]" : "border border-[#e0d8cc] bg-white text-[#1A1A2E] hover:bg-[#f8f4ec]"
      }`}
    >
      {liked ? "❤️" : "🤍"}
      {count} likes
    </button>
  )
}
