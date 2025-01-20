import React, { useState, useEffect } from "react";
import "./css/SongModal.css"; // Add styles for the modal
import { getArtistsApi, getGenresApi } from "../apis/Api";

const SongModal = ({ isOpen, onClose, onSubmit, song }) => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    imageUrl: "",
    audioUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistsAndGenres = async () => {
      try {
        const [artistsResponse, genresResponse] = await Promise.all([
          getArtistsApi(),
          getGenresApi(),
        ]);
        setArtists(
          artistsResponse.data.data.artist.map((artist) => ({
            ...artist,
            _id: String(artist._id),
          }))
        );
        setGenres(
          genresResponse.data.data.genre.map((genre) => ({
            ...genre,
            _id: String(genre._id),
          }))
        );
      } catch (err) {
        console.error("Error fetching artists or genres:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistsAndGenres();
  }, []);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || "",
        artist: String(song.artist) || "",
        genre: String(song.genre) || "",
        imageUrl: song.imageUrl || "",
        audioUrl: song.audioUrl || "",
      });
    }
  }, [song]);

  useEffect(() => {
    console.log("Artists:", artists);
    console.log("Genres:", genres);
    console.log("Form Data:", formData);
  }, [artists, genres, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          audioUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData);
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("artistId", formData.artist);
    submissionData.append("genre", formData.genre);
    if (imageFile) {
      submissionData.append("image", imageFile);
    }
    if (audioFile) {
      submissionData.append("audio", audioFile);
    }

    onSubmit(submissionData);
  };

  return (
    isOpen && (
      <div className="song-modal-overlay">
        <div className="song-modal-content">
          <button className="song-close-btn" onClick={onClose}>
            &times;
          </button>
          <h2>{song ? "Edit Song" : "Add Song"}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form className="song-form" onSubmit={handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Artist:
                <select
                  name="artist"
                  value={formData.artist || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Artist</option>
                  {artists.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.displayName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Genre:
                <select
                  name="genre"
                  value={formData.genre || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
                {song && song.imageUrl && (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.imageUrl}`}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginTop: "10px",
                    }}
                  />
                )}
              </label>
              <label>
                Audio:
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                />
                {formData.audioUrl && (
                  <audio controls style={{ marginTop: "10px" }}>
                    <source src={formData.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                {song && song.audioUrl && (
                  <audio controls style={{ marginTop: "10px" }}>
                    <source
                      src={`${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${song.audioUrl}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </label>
              <button className="song-button" type="submit">
                {song ? "Update" : "Add"}
              </button>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default SongModal;
