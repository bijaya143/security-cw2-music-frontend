import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/AllFavorite.css";
import { getFavoritesApi } from "../../apis/Api";
import debounce from "lodash.debounce";

const AllFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const isInitialMount = useRef(true);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFavoritesApi(page);
      if (res.data.data.favorite.length > 0) {
        setFavorites((prevFavorites) => [
          ...prevFavorites,
          ...res.data.data.favorite,
        ]);
        setHasMore(res.data.data.favorite.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Error fetching favorites");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchFavorites();
      isInitialMount.current = false;
    }
  }, [fetchFavorites]);

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
    <div className="all-songs">
      <div className="hero-image">
        <img src="/assets/images/hero-image-3.jpg" alt="Hero" />
        <div className="hero-overlay">
          <h1>Discover Your Favorite Songs</h1>
        </div>
      </div>
      <div className="favorite-songs-container">
        {favorites.map((song) => (
          <div key={song.id} className="favorite-song-item">
            <Link to={`/song/${song.song._id}`} className="favorite-song-link">
              <div className="favorite-song-image">
                <img
                  src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.song.imageUrl}`}
                  alt={song.song.title}
                  onError={handleImageError}
                />
              </div>
              <div className="favorite-song-info">
                <h3 className="favorite-song-name">{song.song.title}</h3>
                <p className="favorite-song-details">
                  Artist: {song.song.artist}
                </p>
                <p className="favorite-song-details">
                  <i className="fas fa-play-circle icon"></i>
                  Play Count: {song.song.playCount}
                </p>
              </div>
            </Link>
          </div>
        ))}
        {loading && page > 1 && <div className="loading">Loading more...</div>}
      </div>
    </div>
  );
};

export default AllFavorites;
