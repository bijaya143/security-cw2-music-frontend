import React, { useState, useEffect } from "react";
import "./css/SongModal.css";

const GenreModal = ({ isOpen, onClose, onSubmit, genre }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || "",
      });
    }
  }, [genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData);
    const submissionData = new FormData();
    submissionData.append("name", formData.name);

    onSubmit(submissionData);
  };

  return (
    isOpen && (
      <div className="song-modal-overlay">
        <div className="song-modal-content">
          <button className="song-close-btn" onClick={onClose}>
            &times;
          </button>
          <h2>{genre ? "Edit Genre" : "Add Genre"}</h2>
          <form className="song-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <button className="song-button" type="submit">
              {genre ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default GenreModal;
