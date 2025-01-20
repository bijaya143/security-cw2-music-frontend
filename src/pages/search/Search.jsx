import React, { useEffect, useState, useCallback, useRef } from "react";
import Library from "../../components/Library";
import { Link, useSearchParams } from "react-router-dom";
import { getSearchSongsApi } from "../../apis/Api";
import "../css/Search.css";
import debounce from "lodash.debounce";

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isInitialMount = useRef(true);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSearchSongsApi(page, keyword);
      if (res.data.data.song.length > 0) {
        // Filter out any duplicate songs
        setSongs((prevSongs) => {
          const newSongs = res.data.data.song.filter(
            (song) =>
              !prevSongs.some((existingSong) => existingSong.id === song.id)
          );
          return [...prevSongs, ...newSongs];
        });
        setHasMore(res.data.data.song.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load songs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    if (isInitialMount.current) {
      fetchSongs();
      isInitialMount.current = false;
    } else {
      // Fetch songs whenever the keyword changes
      setSongs([]); // Clear current results
      setPage(1); // Reset page to 1
      fetchSongs();
    }
  }, [keyword, fetchSongs]);

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

  if (loading && page === 1) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 p-4">
          <Library />
        </div>
        <div className="col-md-9 p-3">
          <h3 className="search-title">Search Results for: {keyword}</h3>
          <div className="search-results">
            {songs.length > 0 ? (
              songs.map((trendingSong) => (
                <Link
                  key={trendingSong._id}
                  to={`/song/${trendingSong._id}`}
                  className="search-item"
                >
                  <div className="search-image-container">
                    <img
                      alt={trendingSong.title}
                      src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${trendingSong.imageUrl}`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = "/assets/images/default_image.png";
                      }}
                    />
                  </div>
                  <div className="search-details">
                    <p className="search-title-text">{trendingSong.title}</p>
                    <p className="search-artist-text">{trendingSong.artist}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div>No results found</div>
            )}
          </div>
          {loading && page > 1 && <div>Loading more...</div>}
        </div>
      </div>
    </div>
  );
};

export default Search;
