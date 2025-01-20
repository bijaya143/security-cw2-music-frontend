import React, { useEffect, useState } from "react";
import "../css/Artist.css";
import { Link, useParams } from "react-router-dom";
import { getArtistApi, getSongsByArtistIdApi } from "../../apis/Api";

const Artist = () => {
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const artistResponse = await getArtistApi(id);
        console.log("Artist API response:", artistResponse.data);
        setArtist(artistResponse.data.data.artist);

        const songsResponse = await getSongsByArtistIdApi(
          id,
          artistResponse.data.data.artist.displayName
        );
        console.log("Songs API response:", songsResponse.data);
        setSongs(songsResponse.data.data.song);
      } catch (err) {
        console.error("Error fetching artist or songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (!artist) return <p>Artist not found</p>;

  return (
    <div className="artist-page">
      <header className="artist-header">
        <div className="artist-image">
          <img
            src={process.env.REACT_APP_BACKEND_IMAGE_BASE_URL + artist.imageUrl}
            alt={artist.name}
          />
        </div>
        <div className="artist-info">
          <h1 className="artist-name">{artist.displayName}</h1>
          <p className="artist-bio">
            <i className="bi bi-play-circle"></i>
            Total Stream Count: {artist.streamCount}
          </p>
        </div>
      </header>
      <section className="songs-list">
        <h2>Songs by {artist.displayName}</h2>
        <ul>
          {songs.map((song) => (
            <Link
              to={`/song/${song._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li key={song.id} className="song-item">
                <img
                  src={
                    process.env.REACT_APP_BACKEND_IMAGE_BASE_URL + song.imageUrl
                  }
                  alt={song.title}
                  className="song-image"
                />
                <div className="song-info">
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-artist">{song.artist}</p>
                  <p className="song-genre">{song.genre}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Artist;
