// src/App.tsx — VERSION MISE À JOUR
// Ajout des routes du module Réseau & Recherche (Zaineb)
// Les nouvelles routes sont marquées avec le commentaire // [ZAINEB]

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes existantes (équipe)
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BadgeCard from "./components/BadgeCard";
import ProfilePage from "./profile/ProfilePage";
import EditProfileForm from "./profile/EditProfileForm";
import PublicProfileView from "./profile/PublicProfileView";
import FeedPage from "./pages/FeedPage";

// [ZAINEB] Nouvelles routes — module Réseau & Recherche
import SearchPage from "./pages/SearchPage";
import ExplorePage from "./pages/ExplorePage";
import MessagingPage from "./pages/MessagingPage";
import ConnectionsList from "./pages/ConnectionsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes existantes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/badge" element={<BadgeCard niveau="Confirmé" />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/public-profile/:chefId" element={<PublicProfileView />} />

        {/* [ZAINEB] Nouvelles routes */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/messages" element={<MessagingPage />} />
        <Route path="/connections" element={<ConnectionsList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
