import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/authentication/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./pages/homepage/Homepage";
import Register from "./pages/authentication/Register";
import NotFound from "./pages/notfound/NotFound";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoutes";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import Search from "./pages/search/Search";
import SongDetail from "./pages/song/SongDetail";
import Playlist from "./pages/playlist/Playlist";
import AllPlaylists from "./pages/playlist/AllPlaylist";
import Footer from "./components/Footer";
import AllFavorites from "./pages/favorite/AllFavorite";
import AllTrendingSongs from "./pages/trendingSongs/AllTrendingSongs";
import AllTopArtists from "./pages/topArtists/AllTopArtists";
import Artist from "./pages/artist/Artist";
import Genre from "./pages/genre/Genre";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminArtist from "./pages/admin/artist/AdminArtist";
import AdminSong from "./pages/admin/song/AdminSong";
import AdminCustomer from "./pages/admin/customer/AdminCustomer";
import AdminProtectedRoute from "./utils/AdminProtectedRoutes";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import AdminGenre from "./pages/admin/genre/AdminGenre";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/song/:id"
          element={
            <ProtectedRoute>
              <SongDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlist/:id"
          element={
            <ProtectedRoute>
              <Playlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <AllPlaylists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <AllFavorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trending-songs"
          element={
            <ProtectedRoute>
              <AllTrendingSongs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-artists"
          element={
            <ProtectedRoute>
              <AllTopArtists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <ProtectedRoute>
              <Artist />
            </ProtectedRoute>
          }
        />
        <Route path="/genres" element={<Genre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <AdminProtectedRoute>
              <AdminArtist />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/songs"
          element={
            <AdminProtectedRoute>
              <AdminSong />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminProtectedRoute>
              <AdminCustomer />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/genres"
          element={
            <AdminProtectedRoute>
              <AdminGenre />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
