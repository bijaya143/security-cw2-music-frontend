import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/AllTrending.css";
import { getTrendingSongsApi } from "../../apis/Api";
import debounce from "lodash.debounce";

const AllTrendingSongs = () => {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const isInitialMount = useRef(true);

  const fetchTrendingSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTrendingSongsApi(page);
      if (res.data.data.song.length > 0) {
        setTrendingSongs((prevTrendingSongs) => [
          ...prevTrendingSongs,
          ...res.data.data.song,
        ]);
        setHasMore(res.data.data.song.length > 0);
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
      fetchTrendingSongs();
      isInitialMount.current = false;
    }
  }, [fetchTrendingSongs]);

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
    <div className="trending-all-songs">
      <div className="trending-hero-image">
        <img src="/assets/images/hero-songs.gif" alt="Hero" />
      </div>
      <div className="trending-songs-container">
        {trendingSongs.map((song) => (
          <div key={song.id} className="trending-song-item">
            <Link to={`/song/${song._id}`} className="trending-song-link">
              <div className="trending-song-image">
                <img
                  src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.imageUrl}`}
                  alt={song.title}
                  onError={handleImageError}
                />
              </div>
              <div className="trending-song-info">
                <h3 className="trending-song-name">{song.title}</h3>
                <p className="trending-song-details">Artist: {song.artist}</p>
                <p className="trending-song-details">
                  <i className="fas fa-play-circle trending-icon"></i>
                  Play Count: {song.playCount}
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

export default AllTrendingSongs;
