import { useState } from "react"
import CommentSection from "./CommentSection"
import LikeButton from "./LikeButton"

type CommentData = {
  id: string
  author: string
  content: string
  time: string
}

type PostData = {
  id: string
  chefName: string
  avatar: string
  specialite: string
  region: string
  title: string
  text: string
  image: string
  likes: number
  liked: boolean
  comments: CommentData[]
  shares: number
  createdAt: string
}

type Props = {
  post: PostData
  onLike: () => void
  onComment: (postId: string, content: string) => void
  onShare: () => void
}

export default function PostCard({ post, onLike, onComment, onShare }: Props) {
  const [showComments, setShowComments] = useState(false)

  return (
    <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-[#ece5d8] px-6 py-5">
        <img src={post.avatar} alt={post.chefName} className="h-14 w-14 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A2E]">{post.chefName}</h3>
              <p className="text-sm text-gray-500">{post.specialite} • {post.region}</p>
            </div>
            <span className="rounded-full bg-[#F7F2E8] px-3 py-1 text-xs font-medium text-[#C49A3C]">
              {post.createdAt}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="rounded-3xl bg-[#F7F2E8] p-4">
          <h4 className="text-xl font-semibold text-[#1A1A2E]">{post.title}</h4>
          <p className="mt-2 text-sm leading-6 text-gray-600">{post.text}</p>
        </div>

        <img src={post.image} alt={post.title} className="h-[300px] w-full rounded-[1.7rem] object-cover" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ece5d8] px-6 py-4">
        <LikeButton liked={post.liked} count={post.likes} onToggle={onLike} />
        <button
          type="button"
          onClick={() => setShowComments((current) => !current)}
          className="rounded-full border border-[#e0d8cc] bg-white px-4 py-2 text-sm text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
        >
          {post.comments.length} commentaire{post.comments.length > 1 ? "s" : ""}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="rounded-full border border-[#e0d8cc] bg-white px-4 py-2 text-sm text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
        >
          🔄 {post.shares} partages
        </button>
      </div>

      {showComments && (
        <div className="border-t border-[#ece5d8] px-6 py-5">
          <CommentSection
            comments={post.comments}
            onAddComment={(content) => onComment(post.id, content)}
          />
        </div>
      )}
    </article>
  )
}
