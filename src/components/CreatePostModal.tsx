import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (title: string, text: string, image: string) => void
}

export default function CreatePostModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [image, setImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setImage(result)
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !text.trim()) return

    const finalImage = image.trim() || "https://images.unsplash.com/photo-1498579809087-ef1e558fd1d7?auto=format&fit=crop&w=800&q=80"
    onCreate(title.trim(), text.trim(), finalImage)
    setTitle("")
    setText("")
    setImage("")
    setImagePreview("")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#1A1A2E]">Nouvelle publication</h2>
            <p className="text-sm text-gray-500">Partage un texte et une image de ton plat.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e0d8cc] px-4 py-2 text-sm text-[#1A1A2E] hover:bg-[#f8f4ec]"
          >
            Fermer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du plat"
              required
              className="w-full rounded-2xl border border-[#e0d8cc] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Description</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Décris ton plat, les textures et les parfums."
              required
              rows={4}
              className="w-full rounded-3xl border border-[#e0d8cc] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Photo du plat</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-[#e0d8cc] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] file:mr-3 file:rounded-xl file:border-0 file:bg-[#1A1A2E] file:px-4 file:py-2 file:text-sm file:text-white"
            />
            <p className="mt-2 text-xs text-gray-500">Tu peux aussi coller une URL si tu préfères.</p>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-2xl border border-[#e0d8cc] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
            />
          </div>

          {imagePreview && (
            <div>
              <img src={imagePreview} alt="Aperçu du plat" className="h-48 w-full rounded-2xl object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#e0d8cc] bg-white px-5 py-3 text-sm text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#1A1A2E] px-5 py-3 text-sm font-medium text-[#F5F0E8] transition hover:bg-[#2a2a4e]"
            >
              Publier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
