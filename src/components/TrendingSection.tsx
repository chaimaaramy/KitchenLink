type TrendingItem = {
  id: string
  dish: string
  chef: string
  likes: number
  category: string
}

type Props = {
  items: TrendingItem[]
}

export default function TrendingSection({ items }: Props) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C49A3C]">Tendances</p>
          <h2 className="text-xl font-semibold text-[#1A1A2E]">Plats les plus likés de la semaine</h2>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-[#f1e9dc] bg-[#faf6f0] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[#1A1A2E]">{item.dish}</p>
                <p className="text-sm text-gray-500">{item.chef} • {item.category}</p>
              </div>
              <span className="rounded-full bg-[#fff0f0] px-3 py-1 text-sm font-semibold text-[#B91C1C]">
                {item.likes} ❤️
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
