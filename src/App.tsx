// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import BadgeCard from "./components/BadgeCard"
import ProfilePage from "./profile/ProfilePage"
import EditProfileForm from "./profile/EditProfileForm"
import PublicProfileView from "./profile/PublicProfileView"
import FeedPage from "./pages/FeedPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/badge" element={<BadgeCard niveau="Confirmé" />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/public-profile/:chefId" element={<PublicProfileView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App