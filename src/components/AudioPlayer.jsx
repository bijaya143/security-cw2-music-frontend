import React, { useEffect, useRef, useState } from "react";
import AddToPlaylistPopUp from "./AddToPlaylistPopUp";
import "./css/AudioPlayer.css";
import {
  getPlaylistsApi,
  isFavoriteSongApi,
  removeSongFromFavoriteApi,
  addSongToFavoriteApi,
  increaseSongPlayCountApi,
  increaseArtistStreamCountApi,
} from "../apis/Api";
import { toast } from "react-toastify";

const AudioPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const audioRef = useRef(null);

  const handleSeek = (e) => {
    const newTime = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    isPlaying ? handlePause() : handlePlay();
  };

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeSongFromFavoriteApi(song._id);
        toast.success("Song has been removed from the favorite.");
      } else {
        await addSongToFavoriteApi({ songId: song._id });
        toast.success("Song has been added to the favorite.");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        // Call API to increment play count when the component unmounts
        increaseSongPlayCountApi(song._id)
          .then(() => console.log("Play count incremented"))
          .catch((error) =>
            console.error("Error incrementing play count:", error)
          );

        increaseArtistStreamCountApi(song._id, song.artist)
          .then(() => console.log("Stream count incremented"))
          .catch((error) =>
            console.error("Error incrementing stream count:", error)
          );
      }
    };
  }, [song._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlaylistsApi(1);
        setPlaylists(response.data.data.userPlaylists);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await isFavoriteSongApi(song._id);
        setIsFavorite(response.data.success);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [song._id]);

  return (
    <>
      <div className="player-card">
        <img
          className="player-card-img"
          src={process.env.REACT_APP_BACKEND_IMAGE_BASE_URL + song.imageUrl}
          alt={song.title}
        />
        <div className="track-info">
          <div className="track-details">
            <h3 className="track-title">{song.title}</h3>
            <p className="artist-name">{song.artist}</p>
          </div>
          <div className="track-actions">
            <button
              className="favorite-button"
              onClick={toggleFavorite}
              aria-label="Toggle Favorite"
            >
              {isFavorite ? (
                <i className="bi bi-heart-fill"></i>
              ) : (
                <i className="bi bi-heart"></i>
              )}
            </button>
            <button
              className="add-to-playlist-button"
              onClick={togglePopup}
              aria-label="Add to Playlist"
            >
              <i className="bi bi-music-note-list"></i>
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek Bar"
        />
        <audio
          ref={audioRef}
          src={process.env.REACT_APP_BACKEND_IMAGE_BASE_URL + song.audioUrl}
        ></audio>

        <div className="track-duration">
          <p>{formatDuration(currentTime)}</p>
          <p>{formatDuration(duration)}</p>
        </div>

        <div className="audio-controls">
          <button
            className="player-card-button"
            onClick={handlePlayPause}
            aria-label="Play/Pause"
          >
            {isPlaying ? (
              <i className="bi bi-pause"></i>
            ) : (
              <i className="bi bi-play"></i>
            )}
          </button>
        </div>

        <div className="song-details">
          <div className="song-detail-item">
            <i className="bi bi-calendar-event"></i>
            Created Date: {new Date(song.createdAt).toLocaleDateString()}
          </div>
          <div className="song-detail-item">
            <i className="bi bi-play-circle"></i>
            Total Play Count: {song.playCount}
          </div>
          <div className="song-detail-item">
            <i className="bi bi-heart"></i>
            Total Favorites: {song.favoriteCount}
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <AddToPlaylistPopUp
          playlists={playlists}
          song={song}
          onClose={togglePopup}
        />
      )}
    </>
  );
};

export default AudioPlayer;
