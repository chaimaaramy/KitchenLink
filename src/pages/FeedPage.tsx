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
  chefId?: string     // ← ajouté pour rendre le profil cliquable depuis PostCard
  authorEmail?: string
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
  type: "follow" | "like" | "comment" | "message"
  message: string
  time: string
  read: boolean
  link?: string       // ← ajouté : lien de navigation pour chaque notification
}

const initialNotifications: NotificationData[] = []

// ─── Icônes navbar ───────────────────────────────────────────────────────────
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
  const [posts, setPosts] = useState<PostData[]>([])
  const [notifications, setNotifications] = useState<NotificationData[]>(initialNotifications)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterSpecialite, setFilterSpecialite] = useState("Tous")
  const [filterRegion, setFilterRegion] = useState("Tous")
  const [filterSort, setFilterSort] = useState("recent")
  const [showNotifications, setShowNotifications] = useState(false)
  const [activePage, setActivePage] = useState("feed")

  // ─── Chargement initial des posts et notifications ────────────────────────
  useEffect(() => {
    const fetchPosts = async () => {
  try {
    const storedUser = localStorage.getItem("chef")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const params = new URLSearchParams()
    if (currentUser?.email) params.set("userEmail", currentUser.email)

    // 1. Charge les posts
    const resPosts = await fetch(`http://localhost:5000/api/posts?${params.toString()}`)
    const dataPosts = await resPosts.json()

    // 2. Charge tous les users pour faire la jointure authorEmail → id
    const resUsers = await fetch("http://localhost:5000/api/search")
    const dataUsers = await resUsers.json()
    const users: any[] = Array.isArray(dataUsers.chefs) ? dataUsers.chefs : []

    if (Array.isArray(dataPosts.posts)) {
      const postsWithChefId = dataPosts.posts.map((post: any) => {
        // Cherche le user dont l'email = authorEmail du post
        const author = users.find(
          (u) => u.email?.toLowerCase() === post.authorEmail?.toLowerCase()
        )
        return {
          ...post,
          chefId: author ? String(author.id) : undefined,
        }
      })
      setPosts(postsWithChefId)
    }
  } catch (err) {
    console.error("Erreur fetch posts:", err)
  }
}

    const fetchNotifications = async () => {
      try {
        const storedUser = localStorage.getItem("chef")
        const currentUser = storedUser ? JSON.parse(storedUser) : null
        if (!currentUser?.email) return
        const res = await fetch(
          `http://localhost:5000/api/notifications?userEmail=${encodeURIComponent(currentUser.email)}`
        )
        const data = await res.json()
        if (Array.isArray(data.notifications)) {
          // Ajout du lien de navigation selon le type de notification
          const withLinks = data.notifications.map((n: any) => ({
            ...n,
            link:
              n.type === "message" ? "/messages"
              : n.type === "follow" ? "/connections"
              : n.type === "like" || n.type === "comment" ? "/feed"
              : "/feed",
          }))
          setNotifications(withLinks)
        }
      } catch (err) {
        console.error("Erreur fetch notifications:", err)
      }
    }

    fetchPosts()
    fetchNotifications()

    window.addEventListener("notificationsUpdated", fetchNotifications)
    return () => window.removeEventListener("notificationsUpdated", fetchNotifications)
  }, [])

  // ─── Filtres dynamiques depuis les vrais posts ────────────────────────────
  // Les options de filtre se construisent depuis les posts réels du backend
  // → plus jamais de choix limités ou figés
  const specialities = useMemo(
    () => ["Tous", ...Array.from(new Set(posts.map((p) => p.specialite).filter(Boolean)))],
    [posts]
  )
  const regions = useMemo(
    () => ["Tous", ...Array.from(new Set(posts.map((p) => p.region).filter(Boolean)))],
    [posts]
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const trendingItems = useMemo(
    () =>
      [...posts]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3)
        .map((post) => ({
          id: post.id,
          dish: post.title,
          chef: post.chefName,
          likes: post.likes,
          category: post.specialite || post.region || "Général",
        })),
    [posts]
  )

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesSpecialite = filterSpecialite === "Tous" || post.specialite === filterSpecialite
      const matchesRegion = filterRegion === "Tous" || post.region === filterRegion
      return matchesSpecialite && matchesRegion
    })
    if (filterSort === "popularite") return [...filtered].sort((a, b) => b.likes - a.likes)
    return [...filtered].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  }, [posts, filterSpecialite, filterRegion, filterSort])

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleToggleLike = async (postId: string) => {
    const storedUser = localStorage.getItem("chef")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    if (!currentUser?.email) {
      setPosts((cur) => cur.map((p) => p.id !== postId ? p : {
        ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1,
      }))
      return
    }
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: currentUser.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPosts((cur) => cur.map((p) => p.id === postId ? (data.post as PostData) : p))
    } catch (err) {
      console.error("Erreur like:", err)
    }
  }

  const handleAddComment = async (postId: string, content: string) => {
    const storedUser = localStorage.getItem("chef")
    const currentUser = storedUser ? JSON.parse(storedUser) : {}
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: currentUser.name || "Vous", content, userEmail: currentUser.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPosts((cur) => cur.map((p) => p.id === postId ? (data.post as PostData) : p))
    } catch (err) {
      console.error("Erreur commentaire:", err)
    }
  }

  const handleShare = (postId: string) => {
    setPosts((cur) => cur.map((p) => p.id !== postId ? p : { ...p, shares: p.shares + 1 }))
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setPosts((cur) => cur.filter((p) => p.id !== postId))
    } catch (err) {
      console.error("Erreur suppression:", err)
    }
  }

  const handleCreatePost = async (title: string, text: string, image: string) => {
    const storedUser = localStorage.getItem("chef")
    const currentUser = storedUser ? JSON.parse(storedUser) : {}
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, text, image,
          chefName: currentUser.name || "Chef Link",
          avatar: currentUser.photo || "",
          specialite: currentUser.specialite || "Cuisine fusion",
          region: currentUser.ville || "",
          authorEmail: currentUser.email || "",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPosts((cur) => [{ ...(data.post as PostData), liked: false }, ...cur])
      setShowCreateModal(false)
    } catch (err) {
      console.error("Erreur création post:", err)
    }
  }

  const handleToggleNotifications = async () => {
    const storedUser = localStorage.getItem("chef")
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    if (!showNotifications && currentUser?.email) {
      try {
        const res = await fetch("http://localhost:5000/api/notifications/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: currentUser.email }),
        })
        const data = await res.json()
        if (Array.isArray(data.notifications)) setNotifications(data.notifications)
      } catch (err) {
        console.error("Erreur lecture notifications:", err)
      }
    }
    setShowNotifications((v) => !v)
  }

  // Clic sur une notification → ferme le panneau et navigue vers le bon lien
  const handleNotificationClick = (notif: NotificationData) => {
    setShowNotifications(false)
    if (notif.link) navigate(notif.link)
  }

  const goTo = (path: string, page: string) => {
    setActivePage(page)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-4 py-8 pb-24">
      <div className="mx-auto w-full max-w-6xl space-y-6">

        {/* ─── En-tête ───────────────────────────────────────────────────── */}
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
              onClick={() => navigate("/")}
              className="rounded-2xl border border-red-300 bg-white px-5 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              Déconnexion
            </button>
            {/* NotificationBell reçoit onNotificationClick pour rendre chaque notif cliquable */}
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              open={showNotifications}
              onToggle={handleToggleNotifications}
              onNotificationClick={handleNotificationClick}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* ─── Posts + Filtres ─────────────────────────────────────────── */}
          <section className="space-y-6">

            {/* Filtres — les options viennent des vrais posts backend */}
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Spécialité</label>
                <select
                  value={filterSpecialite}
                  onChange={(e) => setFilterSpecialite(e.target.value)}
                  className="w-full rounded-2xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
                >
                  {specialities.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Région</label>
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="w-full rounded-2xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#C49A3C]"
                >
                  {regions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Trier par</label>
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

            {/* Réinitialiser les filtres si actifs */}
            {(filterSpecialite !== "Tous" || filterRegion !== "Tous") && (
              <button
                onClick={() => { setFilterSpecialite("Tous"); setFilterRegion("Tous") }}
                className="text-xs text-[#C49A3C] hover:underline"
              >
                ✕ Réinitialiser les filtres
              </button>
            )}

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
                  onDelete={() => handleDeletePost(post.id)}
                />
              ))
            )}
          </section>

          {/* ─── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="space-y-6">
            <TrendingSection items={trendingItems} />

            {/* Raccourcis rapides — remplace "Filtrer rapidement" statique */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Accès rapide</h2>
              <div className="grid gap-3">

                {/* Chaque carte est maintenant cliquable */}
                <button
                  onClick={() => { setFilterSort("popularite"); setFilterSpecialite("Tous"); setFilterRegion("Tous") }}
                  className="w-full text-left rounded-2xl bg-[#F7F2E8] p-4 hover:bg-[#ede5d4] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em] font-medium">🔥 Popularité</p>
                  <p className="mt-1 text-sm text-gray-600">Trier par nombre de likes</p>
                </button>

                <button
                  onClick={() => goTo("/search", "search")}
                  className="w-full text-left rounded-2xl bg-[#F7F2E8] p-4 hover:bg-[#ede5d4] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em] font-medium">🔍 Rechercher</p>
                  <p className="mt-1 text-sm text-gray-600">Trouver un chef par nom ou ville</p>
                </button>

                <button
                  onClick={() => goTo("/explore", "explore")}
                  className="w-full text-left rounded-2xl bg-[#F7F2E8] p-4 hover:bg-[#ede5d4] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em] font-medium">🌍 Explorer</p>
                  <p className="mt-1 text-sm text-gray-600">Découvrir des chefs à suivre</p>
                </button>

                <button
                  onClick={() => goTo("/messages", "messages")}
                  className="w-full text-left rounded-2xl bg-[#F7F2E8] p-4 hover:bg-[#ede5d4] transition-colors cursor-pointer"
                >
                  <p className="text-sm text-[#C49A3C] uppercase tracking-[0.12em] font-medium">💬 Messages</p>
                  <p className="mt-1 text-sm text-gray-600">Voir vos conversations directes</p>
                </button>

              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Navbar bas ──────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e0d8cc] shadow-lg">
        <div className="mx-auto max-w-lg flex items-center justify-around px-2 py-2">
          {[
            { path: "/feed", page: "feed", label: "Fil", Icon: IconFeed },
            { path: "/search", page: "search", label: "Recherche", Icon: IconSearch },
            { path: "/explore", page: "explore", label: "Explorer", Icon: IconExplore },
            { path: "/messages", page: "messages", label: "Messages", Icon: IconMessages },
            { path: "/connections", page: "connections", label: "Réseau", Icon: IconConnections },
            { path: "/profile", page: "profile", label: "Profil", Icon: IconProfile },
          ].map(({ path, page, label, Icon }) => (
            <button
              key={page}
              onClick={() => goTo(path, page)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                activePage === page ? "text-[#C49A3C]" : "text-gray-400 hover:text-[#C49A3C]"
              }`}
            >
              <Icon />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
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
