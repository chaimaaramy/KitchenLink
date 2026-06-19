const express = require('express');
const router = express.Router();
const {
  findUserByEmail,
  createUser,
  updateUserBadge,
  createPost,
  deletePost,
  addCommentToPost,
  togglePostLike,
  followChef,
  unfollowChef,
  getNotificationsForUser,
  markNotificationsRead,
  createNotification,
  searchChefs,
  createMessage,
  getMessagesByConversation,
  getPosts,
} = require('../utils/db');

// Route de test
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend marche!' });
});

// REGISTER
router.post('/register', (req, res) => {
  const { email, password, name, specialite, restaurant, ville, experience, bio } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password et name requis' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email déjà utilisé' });
  }

  const user = createUser(email, password, name, specialite, restaurant, ville, experience, bio);
  res.json({ 
    message: 'Utilisateur créé!', 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      specialite: user.specialite,
      restaurant: user.restaurant,
      ville: user.ville,
      experience: user.experience,
      bio: user.bio,
      badge: user.badge,
      badges: user.badges || [],
      photo: user.photo,
      certification: user.certification,
      followers: user.followers || [],
      following: user.following || [],
    } 
  });
});
// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et password requis' });
  }

  const user = findUserByEmail(email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Email ou password incorrect' });
  }

  res.json({ 
    message: 'Connecté!', 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      specialite: user.specialite,
      restaurant: user.restaurant,
      ville: user.ville,
      experience: user.experience,
      bio: user.bio,
      badge: user.badge,
      badges: user.badges || [],
      photo: user.photo,
      certification: user.certification,
      followers: user.followers || [],
      following: user.following || [],
    } 
  });
});

// CRÉER UNE PUBLICATION
router.post('/posts', (req, res) => {
  const {
    title,
    text,
    image,
    chefName,
    avatar,
    specialite,
    region,
    authorEmail,
  } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Title et text requis' });
  }

  const post = createPost({
    title,
    text,
    image,
    chefName,
    avatar,
    specialite,
    region,
    authorEmail,
    likes: 0,
    liked: false,
    comments: [],
    shares: 0,
    createdAt: 'À l\'instant'
  });

  res.status(201).json({
    message: 'Publication créée',
    post
  });
});

// SUPPRIMER UNE PUBLICATION
router.delete('/posts/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Id du post requis' });
  }

  const deleted = deletePost(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Publication introuvable' });
  }

  res.json({ message: 'Publication supprimée' });
});

// COMMENTER UNE PUBLICATION
router.post('/posts/:id/comment', (req, res) => {
  const { id } = req.params;
  const { author, content, userEmail } = req.body;

  if (!id || !content) {
    return res.status(400).json({ error: 'Id du post et contenu requis' });
  }

  const comment = {
    id: `comment-${Date.now()}`,
    author: author || 'Anonyme',
    content,
    time: 'À l\'instant',
  };

  const updatedPost = addCommentToPost(id, comment);
  if (!updatedPost) {
    return res.status(404).json({ error: 'Publication introuvable' });
  }

  const updatedPostWithLiked = {
    ...updatedPost,
    liked: Boolean(userEmail && Array.isArray(updatedPost.likedBy) && updatedPost.likedBy.includes(userEmail)),
  };

  if (userEmail && updatedPost.authorEmail && userEmail !== updatedPost.authorEmail) {
    createNotification({
      userEmail: updatedPost.authorEmail,
      fromEmail: userEmail,
      type: 'comment',
      message: (author || "Quelqu'un") + ' a commenté votre publication.',
      time: 'À l\'instant',
      relatedPostId: updatedPost.id,
      read: false,
    });
  }

  res.status(201).json({ message: 'Commentaire ajouté', post: updatedPostWithLiked });
});

// J'AIME / TOGGLE LIKE
router.post('/posts/:id/like', (req, res) => {
  const { id } = req.params;
  const { userEmail } = req.body;

  if (!id || !userEmail) {
    return res.status(400).json({ error: 'Id du post et email requis' });
  }

  const result = togglePostLike(id, userEmail);
  if (!result) {
    return res.status(404).json({ error: 'Publication introuvable' });
  }

  const updatedPost = {
    ...result.updatedPost,
    liked: Boolean(userEmail && Array.isArray(result.updatedPost.likedBy) && result.updatedPost.likedBy.includes(userEmail)),
  };

  if (updatedPost.authorEmail && updatedPost.authorEmail !== userEmail && result.liked) {
    createNotification({
      userEmail: updatedPost.authorEmail,
      fromEmail: userEmail,
      type: 'like',
      message: `Votre publication a reçu un nouveau like.`,
      time: 'À l\'instant',
      relatedPostId: updatedPost.id,
      read: false,
    });
  }

  res.status(200).json({ message: 'Like mis à jour', post: updatedPost, liked: result.liked });
});

// SUIVRE UN CHEF
router.post('/follow/:id', (req, res) => {
  const { id } = req.params;
  const { followerEmail } = req.body;

  if (!id || !followerEmail) {
    return res.status(400).json({ error: 'Id du chef et email du follower requis' });
  }

  const result = followChef(id, followerEmail);
  if (!result) {
    return res.status(404).json({ error: 'Chef ou follower introuvable' });
  }

  createNotification({
    userEmail: result.chef.email || '',
    fromEmail: followerEmail,
    type: 'follow',
    message: 'Vous avez un nouvel abonné.',
    time: 'À l\'instant',
    relatedPostId: null,
    read: false,
  });

  res.status(200).json({ message: 'Chef suivi', chef: result.chef, user: result.user });
});

// NE PLUS SUIVRE UN CHEF
router.post('/unfollow/:id', (req, res) => {
  const { id } = req.params;
  const { followerEmail } = req.body;

  if (!id || !followerEmail) {
    return res.status(400).json({ error: 'Id du chef et email du follower requis' });
  }

  const result = unfollowChef(id, followerEmail);
  if (!result) {
    return res.status(404).json({ error: 'Chef ou follower introuvable' });
  }

  res.status(200).json({ message: 'Chef non suivi', chef: result.chef, user: result.user });
});

// NOTIFICATIONS UTILISATEUR
router.get('/notifications', (req, res) => {
  const { userEmail } = req.query;
  if (!userEmail) {
    return res.status(400).json({ error: 'userEmail requis' });
  }
  const notifications = getNotificationsForUser(String(userEmail));
  res.json({ notifications });
});

router.post('/notifications/read', (req, res) => {
  const { userEmail } = req.body;
  if (!userEmail) {
    return res.status(400).json({ error: 'userEmail requis' });
  }
  const notifications = markNotificationsRead(userEmail);
  res.json({ notifications });
});

// CHERCHER DES CHEFS
router.get('/search', (req, res) => {
  const { q, specialite, ville, restaurant } = req.query;
  const chefs = searchChefs({ q, specialite, ville, restaurant });
  res.json({ chefs });
});

// ENVOYER UN MESSAGE
router.post('/messages', (req, res) => {
  const { fromEmail, toEmail, content } = req.body;

  if (!fromEmail || !toEmail || !content) {
    return res.status(400).json({ error: 'fromEmail, toEmail et content requis' });
  }

  const message = createMessage({ fromEmail, toEmail, content, createdAt: 'À l\'instant' });

  if (fromEmail !== toEmail) {
    createNotification({
      userEmail: toEmail,
      fromEmail,
      type: 'message',
      message: 'Vous avez reçu un nouveau message.',
      time: 'À l\'instant',
      relatedPostId: null,
      read: false,
    });
  }

  res.status(201).json({ message: 'Message envoyé', data: message });
});

router.get('/messages', (req, res) => {
  const { userEmail, chefEmail } = req.query;

  if (!userEmail || !chefEmail) {
    return res.status(400).json({ error: 'userEmail et chefEmail requis' });
  }

  const messages = getMessagesByConversation(String(userEmail), String(chefEmail));
  res.json({ messages });
});

// RÉCUPÉRER LES PUBLICATIONS
router.get('/posts', (req, res) => {
  const { userEmail } = req.query;
  try {
    const posts = getPosts().map((post) => {
      const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
      return {
        ...post,
        liked: Boolean(userEmail && likedBy.includes(String(userEmail))),
      };
    });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les posts' });
  }
});
// AJOUTER / METTRE À JOUR UN BADGE POUR UN CHEF
router.post('/chefs/badges', (req, res) => {
  const { email, badge } = req.body;

  if (!email || !badge) {
    return res.status(400).json({ error: 'Email et badge requis' });
  }

  const updatedUser = updateUserBadge(email, badge);

  if (!updatedUser) {
    return res.status(404).json({ error: 'Chef introuvable' });
  }

  res.json({
    message: 'Badge ajouté avec succès',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      badge: updatedUser.badge,
      badges: updatedUser.badges || []
    }
  });
});

module.exports = router;