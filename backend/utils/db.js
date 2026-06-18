const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../users.json');
const POSTS_FILE = path.join(__dirname, '../posts.json');

// Lire les utilisateurs
function getUsers() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder les utilisateurs
function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// Lire les posts
function getPosts() {
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder les posts
function savePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Trouver un utilisateur par email
function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

// Créer un utilisateur
function createUser(email, password, name, specialite = "", restaurant = "", ville = "", experience = 0, bio = "") {
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    email,
    password,
    name,
    specialite,
    restaurant,
    ville,
    experience,
    bio,
    photo: "",
    certification: "",
    badge: "Junior",
    badges: []
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

function updateUserBadge(email, badgeValue) {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);

  if (index === -1) {
    return null;
  }

  const updatedUser = {
    ...users[index],
    badge: badgeValue,
    badges: Array.isArray(users[index].badges)
      ? Array.from(new Set([...(users[index].badges || []), badgeValue]))
      : [badgeValue]
  };

  users[index] = updatedUser;
  saveUsers(users);
  return updatedUser;
}

function createPost(postData) {
  const posts = getPosts();
  const newPost = {
    id: postData.id || `post-${Date.now()}`,
    chefName: postData.chefName || 'Chef',
    avatar: postData.avatar || '',
    specialite: postData.specialite || '',
    region: postData.region || '',
    title: postData.title || '',
    text: postData.text || '',
    image: postData.image || '',
    likes: postData.likes || 0,
    liked: Boolean(postData.liked),
    comments: Array.isArray(postData.comments) ? postData.comments : [],
    shares: postData.shares || 0,
    createdAt: postData.createdAt || 'À l\'instant',
    authorEmail: postData.authorEmail || ''
  };

  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

module.exports = {
  getUsers,
  saveUsers,
  findUserByEmail,
  createUser,
  updateUserBadge,
  getPosts,
  savePosts,
  createPost
};