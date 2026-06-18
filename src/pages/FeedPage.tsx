import { useMemo, useState, useEffect } from "react"
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

// Icônes SVG inline pour la navbar (pas de dépendance externe)
function IconFeed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}
function IconExplore() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
    </svg>
  )
}
function IconMessages() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}
function IconConnections() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a2 2 0 100-4 2 2 0 000 4zM3 16a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  )
}
function IconProfile() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.232.797 5.879 2.113M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function FeedPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<PostData[]>(initialPosts)
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/posts')
          const data = await res.json()
          if (Array.isArray(data.posts)) {
            setPosts(data.posts)
          }
        } catch (err) {
          console.error('Erreur fetch posts:', err)
        }
      }

      fetchPosts()
    }, [])
  const [notifications, setNotifications] = useState<NotificationData[]>(initialNotifications)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterSpecialite, setFilterSpecialite] = useState("Tous")
  const [filterRegion, setFilterRegion] = useState("Tous")
  const [filterSort, setFilterSort] = useState("recent")
  const [showNotifications, setShowNotifications] = useState(false)

  // Page active dans la navbar (pour surligner l'icône courante)
  const [activePage, setActivePage] = useState("feed")

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

  const handleCreatePost = async (title: string, text: string, image: string) => {
    try {
      const storedUser = localStorage.getItem("chef")
      const currentUser = storedUser ? JSON.parse(storedUser) : {}

      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          image,
          chefName: currentUser.name || "Chef Link",
          avatar: currentUser.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=60",
          specialite: currentUser.specialite || "Cuisine fusion",
          region: currentUser.ville || "Tunis",
          authorEmail: currentUser.email || "",
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Impossible de publier")
      }

      const newPost = data.post as PostData
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
    } catch (error) {
      console.error("Erreur lors de la création du post:", error)
    }
  }

  const handleToggleNotifications = () => {
    setShowNotifications((visible) => !visible)
    if (!showNotifications) {
      setNotifications((current) => current.map((item) => ({ ...item, read: true })))
    }
  }

  // Navigation avec mise à jour de l'icône active
  const goTo = (path: string, page: string) => {
    setActivePage(page)
    navigate(path)
  }

  return (
    // pb-20 pour laisser de l'espace sous le contenu à cause de la navbar fixe en bas
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-8 pb-24">
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

      {/* ───────── NAVBAR BAS ───────── */}
      {/* Barre de navigation fixe en bas de l'écran, visible sur toutes les tailles */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0d8cc] shadow-lg">
        <div className="mx-auto max-w-lg flex items-center justify-around px-2 py-2">

          {/* Fil d'actualité */}
          <button
            onClick={() => goTo("/feed", "feed")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "feed" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconFeed />
            <span className="text-[10px] font-medium">Fil</span>
          </button>

          {/* Recherche */}
          <button
            onClick={() => goTo("/search", "search")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "search" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconSearch />
            <span className="text-[10px] font-medium">Recherche</span>
          </button>

          {/* Explorer */}
          <button
            onClick={() => goTo("/explore", "explore")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "explore" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconExplore />
            <span className="text-[10px] font-medium">Explorer</span>
          </button>

          {/* Messages */}
          <button
            onClick={() => goTo("/messages", "messages")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "messages" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconMessages />
            <span className="text-[10px] font-medium">Messages</span>
          </button>

          {/* Connexions */}
          <button
            onClick={() => goTo("/connections", "connections")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "connections" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconConnections />
            <span className="text-[10px] font-medium">Réseau</span>
          </button>

          {/* Profil */}
          <button
            onClick={() => goTo("/profile", "profile")}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
              activePage === "profile" ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
            }`}
          >
            <IconProfile />
            <span className="text-[10px] font-medium">Profil</span>
          </button>

        </div>
      </nav>

      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePost}
      />
    </div>
  )
}
