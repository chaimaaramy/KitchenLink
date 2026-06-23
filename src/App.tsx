// src/App.tsx
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
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages sans navbar (auth) */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />

        {/* Pages avec navbar (PageLayout) */}
        <Route element={<PageLayout />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfileForm />} />
          <Route path="/badge" element={<BadgeCard niveau="Confirmé" />} />
          <Route path="/public-profile/:chefId" element={<PublicProfileView />} />

          {/* [ZAINEB] */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/connections" element={<ConnectionsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
