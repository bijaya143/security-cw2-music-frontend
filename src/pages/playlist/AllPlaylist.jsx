import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/AllPlaylist.css";
import { getPlaylistsApi } from "../../apis/Api";
import debounce from "lodash.debounce";

const AllPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load
  const [page, setPage] = useState(1); // Current page number

  const isInitialMount = useRef(true);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPlaylistsApi(page);
      if (res.data.data.userPlaylists.length > 0) {
        setPlaylists((prevPlaylists) => [
          ...prevPlaylists,
          ...res.data.data.userPlaylists,
        ]);
        setHasMore(res.data.data.userPlaylists.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Error fetching playlists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchPlaylists();
      isInitialMount.current = false;
    }
  }, [fetchPlaylists]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      if (bottom && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }, 200); // Debounce for 200ms

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const getRandomImage = () => {
    const images = [
      "/assets/images/playlist-default-1.webp",
      "/assets/images/playlist-default-2.jpg",
      "/assets/images/playlist-default-3.jpg",
      "/assets/images/playlist-default-fallback.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handleImageError = (event) => {
    event.target.src = getRandomImage();
    event.target.onerror = null; // Prevent infinite loop if fallback fails
  };

  if (loading && page === 1) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => setPage(1)}>Retry</button>
      </div>
    );
  }

  return (
    <div className="all-playlists">
      <div className="hero-image">
        <img src="/assets/images/hero-image-2.jpg" alt="Hero" />
        <div className="hero-overlay">
          <h1>Discover Your Favorite Playlists</h1>
        </div>
      </div>
      <div className="playlists-container">
        <ul className="playlist-list">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="playlist-item">
              <Link to={`/playlist/${playlist._id}`} className="playlist-link">
                <div className="playlist-image">
                  <img
                    src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${playlist.songs?.[0]?.imageUrl}`}
                    alt={playlist.name}
                    onError={handleImageError}
                  />
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.name}</h3>
                  <p className="playlist-details">
                    Songs: {playlist.songs.length}
                  </p>
                  <p className="playlist-details">
                    Date: {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {loading && page > 1 && <div className="loading">Loading more...</div>}
      </div>
    </div>
  );
};

export default AllPlaylists;
