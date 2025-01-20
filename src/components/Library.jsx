import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./css/Library.css";
import {
  createPlaylistApi,
  getFavoritesApi,
  getPlaylistsApi,
} from "../apis/Api";
import { toast } from "react-toastify";
import Loader from "./Loader";
import PlaylistModal from "./PlaylistModal";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistsResponse, favoritesResponse] = await Promise.all([
          getPlaylistsApi(1),
          getFavoritesApi(1),
        ]);
        setPlaylists(playlistsResponse.data.data.userPlaylists);
        setFavorites(favoritesResponse.data.data.favorite);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreatePlaylist = () => {
    const data = {
      name: newPlaylistName,
    };

    // Logic to create a new playlist
    createPlaylistApi(data)
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            Playlists
          </button>
        </h2>
        <div
          id="collapseOne"
          className="accordion-collapse collapse show"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <ul className="list-group">
              {playlists.length > 0 ? (
                playlists.slice(0, 5).map((item, index) => (
                  <li key={index} className="list-group-item">
                    <Link
                      to={`/playlist/${item._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <FontAwesomeIcon icon={faMusic} className="me-2" />
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-warning text-center">
                  No Playlist Available.
                </p>
              )}
            </ul>
            <Link to="/playlists">
              <h6 className="mt-2 text-center">
                <span className="badge text-danger">See All</span>
              </h6>
            </Link>
            <div className="text-center mt-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Create New Playlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            Favorites
          </button>
        </h2>
        <div
          id="collapseTwo"
          className="accordion-collapse collapse"
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <ul className="list-group">
              {favorites.length > 0 ? (
                favorites.slice(0, 5).map((item, index) => (
                  <li key={index} className="list-group-item">
                    <Link
                      to={`/song/${item.song._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <img
                        className="me-2 rounded-circle"
                        height={25}
                        width={25}
                        src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${item.song.imageUrl}`}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src =
                            "/assets/images/default_image.png";
                        }}
                        style={{ objectFit: "cover" }}
                      />
                      {item.song.title}
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-warning text-center">
                  No Favorites Available.
                </p>
              )}
            </ul>
            <Link to="/favorites">
              <h6 className="mt-2 text-center">
                <span className="badge text-danger">See All</span>
              </h6>
            </Link>
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <PlaylistModal
        show={showModal}
        title="Create New Playlist"
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePlaylist}
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
    </div>
  );
};

Library.propTypes = {
  playlists: PropTypes.array,
  favorites: PropTypes.array,
};

export default Library;
