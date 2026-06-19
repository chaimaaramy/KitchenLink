const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../users.json');
const POSTS_FILE = path.join(__dirname, '../posts.json');
const MESSAGES_FILE = path.join(__dirname, '../messages.json');
const NOTIFICATIONS_FILE = path.join(__dirname, '../notifications.json');

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

// Lire les messages
function getMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder les messages
function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Lire les notifications
function getNotifications() {
  try {
    const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Sauvegarder les notifications
function saveNotifications(notifications) {
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

function createNotification(notificationData) {
  const notifications = getNotifications();
  const newNotification = {
    id: notificationData.id || `notif-${Date.now()}`,
    userEmail: notificationData.userEmail || '',
    type: notificationData.type || 'like',
    message: notificationData.message || '',
    time: notificationData.time || 'À l\'instant',
    read: notificationData.read === true,
    fromEmail: notificationData.fromEmail || null,
    relatedPostId: notificationData.relatedPostId || null,
  };

  notifications.unshift(newNotification);
  saveNotifications(notifications);
  return newNotification;
}

function getNotificationsForUser(userEmail) {
  if (!userEmail) return [];
  const notifications = getNotifications();
  return notifications.filter((notification) => notification.userEmail === userEmail);
}

function markNotificationsRead(userEmail) {
  if (!userEmail) return [];
  const notifications = getNotifications();
  const updated = notifications.map((notification) =>
    notification.userEmail === userEmail ? { ...notification, read: true } : notification,
  );
  saveNotifications(updated);
  return updated.filter((notification) => notification.userEmail === userEmail);
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
    badges: [],
    followers: [],
    following: [],
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
  const likedBy = Array.isArray(postData.likedBy) ? postData.likedBy : [];
  const newPost = {
    id: postData.id || `post-${Date.now()}`,
    chefName: postData.chefName || 'Chef',
    avatar: postData.avatar || '',
    specialite: postData.specialite || '',
    region: postData.region || '',
    title: postData.title || '',
    text: postData.text || '',
    image: postData.image || '',
    likes: likedBy.length,
    likedBy,
    comments: Array.isArray(postData.comments) ? postData.comments : [],
    shares: postData.shares || 0,
    createdAt: postData.createdAt || 'À l\'instant',
    authorEmail: postData.authorEmail || ''
  };

  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

function togglePostLike(postId, userEmail) {
  const posts = getPosts();
  const index = posts.findIndex((post) => String(post.id) === String(postId));
  if (index === -1) {
    return null;
  }

  const post = posts[index];
  const likedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
  const hasLiked = userEmail && likedBy.includes(userEmail);
  const updatedLikedBy = hasLiked ? likedBy.filter((email) => email !== userEmail) : [...likedBy, userEmail];
  const updatedPost = {
    ...post,
    likedBy: updatedLikedBy,
    likes: updatedLikedBy.length,
  };

  posts[index] = updatedPost;
  savePosts(posts);
  return {
    updatedPost,
    liked: !hasLiked,
  };
}

function deletePost(postId) {
  const posts = getPosts();
  const filteredPosts = posts.filter((post) => post.id !== postId);
  if (filteredPosts.length === posts.length) {
    return null;
  }

  savePosts(filteredPosts);
  return true;
}

function addCommentToPost(postId, comment) {
  const posts = getPosts();
  const index = posts.findIndex((post) => String(post.id) === String(postId));
  if (index === -1) {
    return null;
  }

  const updatedPost = {
    ...posts[index],
    comments: [...(Array.isArray(posts[index].comments) ? posts[index].comments : []), comment],
  };

  posts[index] = updatedPost;
  savePosts(posts);
  return updatedPost;
}

function getMessagesByConversation(userEmail, chefEmail) {
  const messages = getMessages();
  return messages
    .filter((message) =>
      (message.fromEmail === userEmail && message.toEmail === chefEmail) ||
      (message.fromEmail === chefEmail && message.toEmail === userEmail),
    )
    .sort((a, b) => {
      const aId = String(a.id || "");
      const bId = String(b.id || "");
      return aId.localeCompare(bId);
    });
}

function followChef(chefId, followerEmail) {
  const users = getUsers();
  const chefIndex = users.findIndex((user) => String(user.id) === String(chefId));
  const followerIndex = users.findIndex((user) => user.email === followerEmail);

  if (chefIndex === -1 || followerIndex === -1) {
    return null;
  }

  const chef = users[chefIndex];
  const follower = users[followerIndex];

  const chefFollowers = Array.isArray(chef.followers) ? [...chef.followers] : [];
  if (!chefFollowers.includes(followerEmail)) {
    chefFollowers.push(followerEmail);
  }

  const updatedChef = { ...chef, followers: chefFollowers };
  users[chefIndex] = updatedChef;

  const followerFollowing = Array.isArray(follower.following) ? [...follower.following] : [];
  if (!followerFollowing.includes(String(chefId))) {
    followerFollowing.push(String(chefId));
  }

  const updatedFollower = { ...follower, following: followerFollowing };
  users[followerIndex] = updatedFollower;
  saveUsers(users);

  return { chef: updatedChef, user: updatedFollower };
}

function unfollowChef(chefId, followerEmail) {
  const users = getUsers();
  const chefIndex = users.findIndex((user) => String(user.id) === String(chefId));
  const followerIndex = users.findIndex((user) => user.email === followerEmail);

  if (chefIndex === -1 || followerIndex === -1) {
    return null;
  }

  const chef = users[chefIndex];
  const follower = users[followerIndex];

  const updatedChefFollowers = Array.isArray(chef.followers)
    ? chef.followers.filter((email) => email !== followerEmail)
    : [];

  const updatedFollowerFollowing = Array.isArray(follower.following)
    ? follower.following.filter((id) => String(id) !== String(chefId))
    : [];

  const updatedChef = { ...chef, followers: updatedChefFollowers };
  const updatedFollower = { ...follower, following: updatedFollowerFollowing };

  users[chefIndex] = updatedChef;
  users[followerIndex] = updatedFollower;
  saveUsers(users);

  return { chef: updatedChef, user: updatedFollower };
}

function createMessage(messageData) {
  const messages = getMessages();
  const newMessage = {
    id: `msg-${Date.now()}`,
    fromEmail: messageData.fromEmail || '',
    toEmail: messageData.toEmail || '',
    content: messageData.content || '',
    createdAt: messageData.createdAt || 'À l\'instant',
  };

  messages.unshift(newMessage);
  saveMessages(messages);
  return newMessage;
}

function searchChefs({ q, specialite, ville, restaurant } = {}) {
  const users = getUsers();
  const normalizedQ = q ? String(q).toLowerCase() : "";
  const normalizedSpecialite = specialite ? String(specialite).toLowerCase() : "";
  const normalizedVille = ville ? String(ville).toLowerCase() : "";
  const normalizedRestaurant = restaurant ? String(restaurant).toLowerCase() : "";

  if (!normalizedQ && !normalizedSpecialite && !normalizedVille && !normalizedRestaurant) {
    return users;
  }

  return users.filter((user) => {
    const name = String(user.name || "").toLowerCase();
    const spec = String(user.specialite || "").toLowerCase();
    const rest = String(user.restaurant || "").toLowerCase();
    const city = String(user.ville || "").toLowerCase();

    const matchesQuery =
      !normalizedQ ||
      name.includes(normalizedQ) ||
      spec.includes(normalizedQ) ||
      rest.includes(normalizedQ) ||
      city.includes(normalizedQ);
    const matchesSpecialite = !normalizedSpecialite || spec.includes(normalizedSpecialite);
    const matchesVille = !normalizedVille || city.includes(normalizedVille);
    const matchesRestaurant = !normalizedRestaurant || rest.includes(normalizedRestaurant);

    return matchesQuery && matchesSpecialite && matchesVille && matchesRestaurant;
  });
}

module.exports = {
  getUsers,
  saveUsers,
  getPosts,
  savePosts,
  getMessages,
  saveMessages,
  getNotifications,
  saveNotifications,
  createNotification,
  getNotificationsForUser,
  markNotificationsRead,
  findUserByEmail,
  createUser,
  updateUserBadge,
  createPost,
  togglePostLike,
  deletePost,
  addCommentToPost,
  getMessagesByConversation,
  followChef,
  unfollowChef,
  searchChefs,
  createMessage,
};