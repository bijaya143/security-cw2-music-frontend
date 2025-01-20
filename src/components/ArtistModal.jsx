import React, { useState, useEffect } from "react";
import "./css/SongModal.css";

const ArtistModal = ({ isOpen, onClose, onSubmit, artist }) => {
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (artist) {
      setFormData({
        email: artist.email || "",
        imageUrl: artist.imageUrl || "",
        displayName: artist.displayName || "",
      });
    }
  }, [artist]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", formData);
    const submissionData = new FormData();
    submissionData.append("email", formData.email);
    submissionData.append("displayName", formData.displayName);
    if (imageFile) {
      submissionData.append("image", imageFile);
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
          <h2>{artist ? "Edit Artist" : "Add Artist"}</h2>
          <form className="song-form" onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Display Name:
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {(formData.imageUrl || artist?.imageUrl) && (
                <img
                  src={
                    formData.imageUrl ||
                    `${process.env.REACT_APP_BACKEND_IMAGE_BASE_URL}${artist.imageUrl}`
                  }
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
            <button className="song-button" type="submit">
              {artist ? "Update" : "Add"}
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ArtistModal;
