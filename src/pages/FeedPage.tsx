import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import CreatePostModal from "../components/CreatePostModal.tsx"
import NotificationBell from "../components/NotificationBell.tsx"
import PostCard from "../components/PostCard.tsx"
import TrendingSection from "../components/TrendingSection.tsx"

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

type NotificationData = {
  id: string
  type: "follow" | "like" | "comment"
  message: string
  time: string
  read: boolean
}

const initialPosts: PostData[] = [
  {
    id: "post-1",
    chefName: "Amina El Idrissi",
    avatar: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=60",
    specialite: "Cuisine marocaine",
    region: "Casablanca",
    title: "Tajine de kefta au citron confit",
    text: "Un plat parfumé aux épices, servi avec des herbes fraîches et une sauce légèrement acidulée.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    likes: 128,
    liked: false,
    comments: [
      { id: "c1", author: "Nadia", content: "Ce plat donne faim !", time: "2h" },
      { id: "c2", author: "Karim", content: "Belle présentation et saveurs imaginées.", time: "1h" },
    ],
    shares: 14,
    createdAt: "Il y a 3h",
  },
  {
    id: "post-2",
    chefName: "Lucas Martel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=60",
    specialite: "Cuisine française",
    region: "Lyon",
    title: "Tartelette au chocolat et fleur de sel",
    text: "Une pâtisserie fine alliant ganache crémeuse et souvenirs de marchés français.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    likes: 92,
    liked: true,
    comments: [
      { id: "c3", author: "Sofia", content: "Inspiration parfaite pour le dessert du weekend.", time: "5h" },
    ],
    shares: 8,
    createdAt: "Il y a 5h",
  },
  {
    id: "post-3",
    chefName: "Maya Chen",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=60",
    specialite: "Cuisine asiatique",
    region: "Paris",
    title: "Nouilles sautées au gingembre et légumes croquants",
    text: "Des textures équilibrées et des notes fraîches pour un déjeuner gourmand.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    likes: 75,
    liked: false,
    comments: [],
    shares: 3,
    createdAt: "Aujourd'hui",
  },
]

const initialNotifications: NotificationData[] = [
  {
    id: "n1",
    type: "follow",
    message: "Sara a commencé à vous suivre.",
    time: "10m",
    read: false,
  },
  {
    id: "n2",
    type: "like",
    message: "Votre photo de plat a reçu un nouveau like.",
    time: "45m",
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    message: "Pierre a commenté votre recette.",
    time: "1h",
    read: true,
  },
]

const trendingItems = [
  {
    id: "t1",
    dish: "Boulettes de poulet thaï",
    chef: "Léa Nguyen",
    likes: 220,
    category: "Asiatique",
  },
  {
    id: "t2",
    dish: "Raviolis ricotta-épinards",
    chef: "Matteo Rossi",
    likes: 198,
    category: "Italienne",
  },
  {
    id: "t3",
    dish: "Mousse café noisette",
    chef: "Emma Dubois",
    likes: 176,
    category: "Pâtisserie",
  },
]

export default function FeedPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostData[]>(initialPosts)
  const [notifications, setNotifications] = useState<NotificationData[]>(initialNotifications)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterSpecialite, setFilterSpecialite] = useState("Tous")
  const [filterRegion, setFilterRegion] = useState("Tous")
  const [filterSort, setFilterSort] = useState("recent")
  const [showNotifications, setShowNotifications] = useState(false)

  const specialities = useMemo(
    () => ["Tous", ...Array.from(new Set(posts.map((post) => post.specialite)))],
    [posts],
  )

  const regions = useMemo(
    () => ["Tous", ...Array.from(new Set(posts.map((post) => post.region)))],
    [posts],
  )

  const unreadCount = notifications.filter((item) => !item.read).length

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSpecialite = filterSpecialite === "Tous" || post.specialite === filterSpecialite
      const matchesRegion = filterRegion === "Tous" || post.region === filterRegion
      return matchesSpecialite && matchesRegion
    })

    if (filterSort === "popularite") {
      return [...filtered].sort((a, b) => b.likes - a.likes)
    }

    return [...filtered].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  }, [posts, filterSpecialite, filterRegion, filterSort])

  const handleToggleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        }
      }),
    )
  }

  const handleAddComment = (postId: string, content: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        const newComment: CommentData = {
          id: `${postId}-comment-${post.comments.length + 1}`,
          author: "Vous",
          content,
          time: "À l'instant",
        }
        return {
          ...post,
          comments: [...post.comments, newComment],
        }
      }),
    )

    setNotifications((current) => [
      {
        id: `n-${Date.now()}`,
        type: "comment",
        message: "Vous avez répondu à une publication.",
        time: "À l'instant",
        read: false,
      },
      ...current,
    ])
  }

  const handleShare = (postId: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        return { ...post, shares: post.shares + 1 }
      }),
    )
    setNotifications((current) => [
      {
        id: `n-${Date.now()}`,
        type: "like",
        message: "Une publication a été partagée.",
        time: "À l'instant",
        read: false,
      },
      ...current,
    ])
  }

  const handleCreatePost = (title: string, text: string, image: string) => {
    const newPost: PostData = {
      id: `post-${Date.now()}`,
      chefName: "Chef Link",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=60",
      specialite: "Cuisine fusion",
      region: "Tunis",
      title,
      text,
      image,
      likes: 0,
      liked: false,
      comments: [],
      shares: 0,
      createdAt: "À l'instant",
    }

    setPosts((current) => [newPost, ...current])
    setShowCreateModal(false)
    setNotifications((current) => [
      {
        id: `n-${Date.now()}`,
        type: "follow",
        message: "Une nouvelle publication est en ligne.",
        time: "À l'instant",
        read: false,
      },
      ...current,
    ])
  }

  const handleToggleNotifications = () => {
    setShowNotifications((visible) => !visible)
    if (!showNotifications) {
      setNotifications((current) => current.map((item) => ({ ...item, read: true })))
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#C49A3C]">Fil d'actualité</p>
            <h1 className="text-3xl font-semibold text-[#1A1A2E]">Publications des chefs suivis</h1>
            <p className="mt-2 text-sm text-gray-500 max-w-2xl">
              Découvrez les dernières recettes, tendances et retours de la communauté culinaire.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-2xl border border-[#e0d8cc] bg-white px-5 py-3 text-sm font-medium text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
              onClick={() => setShowCreateModal(true)}
            >
              Créer une publication
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="rounded-2xl border border-[#e0d8cc] bg-white px-5 py-3 text-sm font-medium text-[#1A1A2E] transition hover:bg-[#f8f4ec]"
            >
              Voir mon profil
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-2xl border border-red-300 bg-white px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              Déconnexion
            </button>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              open={showNotifications}
              onToggle={handleToggleNotifications}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                  Spécialité
                </label>
                <select
                  value={filterSpecialite}
                  onChange={(e) => setFilterSpecialite(e.target.value)}
                  className="w-full rounded-2xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
                >
                  {specialities.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                  Région
                </label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full rounded-2xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
                >
                  {regions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
                  Trier par
                </label>
                <select
                  value={filterSort}
                  onChange={(e) => setFilterSort(e.target.value)}
                  className="w-full rounded-2xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
                >
                  <option value="recent">Plus récent</option>
                  <option value="popularite">Popularité</option>
                </select>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-sm">
                Aucun post ne correspond à ces filtres.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleToggleLike(post.id)}
                  onComment={handleAddComment}
                  onShare={() => handleShare(post.id)}
                />
              ))
            )}
          </section>

          <aside className="space-y-6">
            <TrendingSection items={trendingItems} />
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Filtrer rapidement</h2>
              <p className="mt-3 text-sm text-gray-500">
                Utilise les filtres pour afficher les chefs par spécialité et région, ou trie les publications selon la popularité.
              </p>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-[#F7F2E8] p-4">
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em]">Popularité</p>
                  <p className="mt-2 text-sm text-gray-600">Affiche les publications avec le plus de likes.</p>
                </div>
                <div className="rounded-2xl bg-[#F7F2E8] p-4">
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em]">Région</p>
                  <p className="mt-2 text-sm text-gray-600">Trouve les spécialités locales de chaque ville.</p>
                </div>
                <div className="rounded-2xl bg-[#F7F2E8] p-4">
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em]">Spécialité</p>
                  <p className="mt-2 text-sm text-gray-600">Sélectionne les chefs qui partagent tes goûts culinaires.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePost}
      />
    </div>
  )
}
