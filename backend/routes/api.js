const express = require('express');
const router = express.Router();
const { findUserByEmail, createUser, updateUserBadge, createPost } = require('../utils/db');

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
      badge: user.badge
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
      certification: user.certification
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

// RÉCUPÉRER LES PUBLICATIONS
router.get('/posts', (req, res) => {
  const { getPosts } = require('../utils/db');
  try {
    const posts = getPosts();
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