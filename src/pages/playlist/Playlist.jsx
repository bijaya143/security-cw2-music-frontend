import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/Playlist.css";
import {
  deletePlaylistApi,
  editPlaylistApi,
  getPlaylistApi,
  increaseArtistStreamCountApi,
  increaseSongPlayCountApi,
} from "../../apis/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faRandom,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PlaylistModal from "../../components/PlaylistModal";

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seekValue, setSeekValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  // Navigate
  const navigate = useNavigate();

  // Fetch playlist data
  useEffect(() => {
    setLoading(true);
    getPlaylistApi(id)
      .then((res) => {
        setPlaylist(res.data.data.playlist);
        setSongs(res.data.data.playlist.songs);
        setNewPlaylistName(res.data.data.playlist.name);
        setCurrentSongIndex(0);
      })
      .catch((err) => {
        console.error("Error fetching playlist:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Handle song play count
  useEffect(() => {
    if (songs.length > 0 && currentSongIndex >= 0) {
      const currentSong = songs[currentSongIndex];
      increaseSongPlayCountApi(currentSong._id)
        .then(() => console.log("Play count incremented"))
        .catch((err) => console.error("Error incrementing play count:", err));

      increaseArtistStreamCountApi(currentSong._id, currentSong.artist)
        .then(() => console.log("Stream count incremented"))
        .catch((err) => console.error("Error incrementing stream count:", err));
    }
  }, [currentSongIndex, songs]);

  // Handle audio playback
  useEffect(() => {
    if (songs.length > 0 && audioRef.current) {
      const currentSong = songs[currentSongIndex];
      audioRef.current.src = `${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${currentSong.audioUrl}`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, isPlaying, songs]);

  // Update seek value and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateSeek = () => setSeekValue(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);

      audio.addEventListener("timeupdate", updateSeek);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("timeupdate", updateSeek);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [currentSongIndex]);

  // Play or pause the audio
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  const playPauseHandler = () => setIsPlaying((prev) => !prev);

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prevIndex + 1) % songs.length
    );
    setIsPlaying(true);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
  };

  const shuffleHandler = () => setShuffle((prev) => !prev);

  const seekHandler = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      setSeekValue(e.target.value);
    }
  };

  const getRandomImage = () => {
    const images = [
      "/assets/images/playlist-default-1.webp",
      "/assets/images/playlist-default-2.jpg",
      "/assets/images/playlist-default-3.jpg",
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleImageError = (event) => {
    event.target.src = getRandomImage();
    event.target.onerror = null; // Prevent infinite loop if fallback fails
  };

  const handleEditPlaylist = () => {
    const data = {
      name: newPlaylistName,
    };

    // Logic to create a new playlist
    editPlaylistApi(id, data)
      .then((res) => {
        toast.success(res.data.data.message);
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch((err) => {
        toast.error(err.response.data.data.message);
      });
    setShowModal(false);
    setNewPlaylistName("");
  };

  const deletePlaylistHandler = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylistApi(id)
        .then((res) => {
          toast.success(res.data.data.message);
          setTimeout(() => navigate("/"), 1000);
        })
        .catch((err) => {
          console.error("Error deleting playlist:", err);
          toast.error(err.response.data.data.message);
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!playlist) {
    return <div>Error: Playlist not found</div>;
  }

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-image">
          <img
            src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${playlist.songs?.[0]?.imageUrl}`}
            alt={playlist.name}
            onError={handleImageError}
          />
        </div>
        <div className="playlist-details">
          <h1 className="playlist-name">{playlist.name}</h1>
          <div className="playlist-info">
            <p>
              Date of Creation:{" "}
              {new Date(playlist.createdAt).toLocaleDateString()}
            </p>
            <p>
              {" "}
              <i className="fas fa-play-circle trending-icon"></i> Songs:{" "}
              {songs.length}
            </p>
          </div>

          <div className="playlist-actions">
            <button onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button className="delete-button" onClick={deletePlaylistHandler}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        </div>
      </div>
      {songs.length > 0 && (
        <>
          <button
            className="playlist-play-all-button"
            onClick={playPauseHandler}
          >
            <FontAwesomeIcon
              icon={isPlaying ? faPause : faPlay}
              className="me-2"
            />
            {isPlaying ? "Playing All" : "Play All"}
          </button>
          <div className="playlist-audio-player">
            <audio ref={audioRef} onEnded={nextSongHandler} />
            <div className="playlist-seek-container">
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={seekValue}
                onChange={seekHandler}
                className="playlist-seek-slider"
              />
              <div className="playlist-seek-time">
                <span>{formatTime(seekValue)}</span>{" "}
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="playlist-controls">
              <button onClick={prevSongHandler}>
                <FontAwesomeIcon icon={faBackward} />
              </button>
              <button
                onClick={playPauseHandler}
                className={isPlaying ? "selected" : ""}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </button>
              <button onClick={nextSongHandler}>
                <FontAwesomeIcon icon={faForward} />
              </button>
              <button
                className={shuffle ? "selected" : ""}
                onClick={shuffleHandler}
              >
                <FontAwesomeIcon icon={faRandom} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Songs Start  */}
      <div className="playlist-songs-container">
        {songs.map((song, index) => (
          <div
            key={index}
            className={`playlist-song-card ${
              index === currentSongIndex ? "playing" : ""
            }`}
            onClick={() => setCurrentSongIndex(index)}
          >
            <img
              src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.imageUrl}`}
              alt={song.title}
              className="playlist-song-image"
              onError={handleImageError}
            />
            <div className="playlist-song-details">
              <h3 className="playlist-song-title">{song.title}</h3>
              <p className="playlist-song-artist">Artist: {song.artist}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Songs End  */}

      {/* Modal Start */}
      <PlaylistModal
        show={showModal}
        title="Update Playlist"
        onClose={() => setShowModal(false)}
        onSubmit={handleEditPlaylist}
      >
        <div className="mb-3">
          <label htmlFor="playlistName" className="form-label">
            Playlist Name
          </label>
          <input
            type="text"
            className="form-control"
            id="playlistName"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            required
          />
        </div>
      </PlaylistModal>
      {/* Modal End */}
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
};

export default Playlist;
