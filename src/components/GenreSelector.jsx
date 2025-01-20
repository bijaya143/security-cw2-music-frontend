import React, { useEffect, useState } from "react";
import "./css/GenreSelector.css";
import { getGenresApi } from "../apis/Api";

const GenreSelector = ({ onSelect }) => {
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenresApi()
      .then((res) => {
        setGenres(res.data.data.genre);
      })
      .catch((error) => {
        console.error("Failed to fetch genres:", error);
      });
  }, []);

  const handleGenreClick = (genreId) => {
    const newSelectedGenreIds = selectedGenreIds.includes(genreId)
      ? selectedGenreIds.filter((id) => id !== genreId)
      : [...selectedGenreIds, genreId];
    setSelectedGenreIds(newSelectedGenreIds);
    onSelect(newSelectedGenreIds);
  };

  return (
    <div className="genre-selector">
      {genres.map((genre) => (
        <div
          key={genre._id}
          className={`genre-card ${
            selectedGenreIds.includes(genre._id) ? "selected" : ""
          }`}
          onClick={() => handleGenreClick(genre._id)}
        >
          <div className="genre-name">{genre.name}</div>
        </div>
      ))}
    </div>
  );
};

export default GenreSelector;
