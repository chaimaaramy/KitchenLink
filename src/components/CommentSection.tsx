import { useState } from "react"

type CommentData = {
  id: string
  author: string
  content: string
  time: string
}

type Props = {
  comments: CommentData[]
  onAddComment: (content: string) => void
}

export default function CommentSection({ comments, onAddComment }: Props) {
  const [commentText, setCommentText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(commentText.trim())
    setCommentText("")
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun commentaire pour l'instant. Sois le premier !</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl bg-[#F7F2E8] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1A1A2E]">{comment.author}</p>
                  <p className="text-xs text-gray-500">{comment.time}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Écris un commentaire..."
          rows={3}
          className="w-full rounded-3xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
        />
        <button
          type="submit"
          className="self-end rounded-2xl bg-[#1A1A2E] px-5 py-3 text-sm font-medium text-[#F5F0E8] transition hover:bg-[#2a2a4e]"
        >
          Publier le commentaire
        </button>
      </form>
    </div>
  )
}
