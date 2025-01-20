import React, { useEffect, useState } from "react";
import "../../css/AdminDashboard.css";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  getArtistsApi,
  getCustomersApi,
  getGenresApi,
  getSongsApi,
} from "../../../apis/Api";

const AdminDashboard = () => {
  const [songsCount, setSongsCount] = useState(0);
  const [artistsCount, setArtistsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [genresCount, setGenresCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistsAndGenres = async () => {
      try {
        const [
          artistsResponse,
          genresResponse,
          customersResponse,
          songsResponse,
        ] = await Promise.all([
          getArtistsApi(),
          getGenresApi(),
          getCustomersApi(),
          getSongsApi(1),
        ]);
        setArtistsCount(artistsResponse.data.data.artist.length);
        setGenresCount(genresResponse.data.data.genre.length);
        setSongsCount(songsResponse.data.data.song.length);
        setUsersCount(customersResponse.data.data.users.length);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      }
    };

    fetchArtistsAndGenres();
  }, []);

  return (
    <div className="dashboard">
      <AdminSidebar />
      <div className="dashboard-content">
        <header className="header">
          <h1>Dashboard</h1>
        </header>
        {error && <p className="error-message">{error}</p>}
        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Total Users</h3>
              <span className="dashboard-card-icon">👤</span>
            </div>
            <p className="dashboard-card-value">{usersCount}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Songs</h3>
              <span className="dashboard-card-icon">🎵</span>
            </div>
            <p className="dashboard-card-value">{songsCount}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Artists</h3>
              <span className="dashboard-card-icon">🎤</span>
            </div>
            <p className="dashboard-card-value">{artistsCount}</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Genres</h3>
              <span className="dashboard-card-icon">📚</span>
            </div>
            <p className="dashboard-card-value">{genresCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
