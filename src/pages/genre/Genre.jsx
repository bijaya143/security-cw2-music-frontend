import React, { useState } from "react";
import GenreSelector from "../../components/GenreSelector";
import "../css/Genre.css";
import { toast } from "react-toastify";
import { meApi, storeUserGenreApi } from "../../apis/Api";
import { useNavigate } from "react-router-dom";

const Genre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const setUser = async () => {
    try {
      const {
        data: {
          data: { userObject },
        },
      } = await meApi();
      localStorage.setItem("user", JSON.stringify(userObject));
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleGenreSelect = (genres) => {
    setSelectedGenres(genres);
  };

  const handleSave = () => {
    if (selectedGenres.length < 3) {
      toast.error("Please, select at least three genres.");
      return;
    }

    const data = {
      genres: selectedGenres,
    };

    storeUserGenreApi(data)
      .then(async (res) => {
        if (res.data?.success === false) {
          toast.error(res.data?.data?.message);
        } else {
          await setUser();
          navigate("/");
        }
      })
      .catch((error) => {
        toast.error("Error occurred while selecting genres.");
      });
  };

  return (
    <div className="genre-container">
      <h1 className="text-center pt-4">Select a Genre</h1>
      <p className="text-secondary">
        Note: For better experience, please select at least three genres.
      </p>
      <GenreSelector onSelect={handleGenreSelect} />
      <button onClick={handleSave} className="save-button">
        Save
      </button>
    </div>
  );
};

export default Genre;
