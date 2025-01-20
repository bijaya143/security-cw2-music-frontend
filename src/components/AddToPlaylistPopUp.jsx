import React from "react";
import "./css/AddToPlaylistPopUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { addSongToPlaylistApi } from "../apis/Api";
import { toast } from "react-toastify";

const AddToPlaylistPopUp = ({ playlists, song, onClose }) => {
  const handleAddSongToPlaylist = async (playlistId) => {
    try {
      const response = await addSongToPlaylistApi(playlistId, song._id);
      toast.success(response.data.data.message);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.response.data.data.message);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h3>Select a Playlist</h3>
        <ul>
          {playlists.length >= 1
            ? playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  onClick={() => handleAddSongToPlaylist(playlist._id)}
                >
                  <FontAwesomeIcon icon={faMusic} className="me-2" />
                  {playlist.name}
                </li>
              ))
            : "No Playlists Found"}
        </ul>
      </div>
    </div>
  );
};

export default AddToPlaylistPopUp;
