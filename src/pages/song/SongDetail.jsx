import React, { useEffect, useState } from "react";
import { getSongApi } from "../../apis/Api";
import Library from "../../components/Library";
import AudioPlayer from "../../components/AudioPlayer";
import { useNavigate, useParams } from "react-router-dom";

const SongDetail = () => {
  const [song, setSong] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getSongApi(id)
      .then((res) => {
        console.log("Song API response:", res.data);
        setSong(res.data.data.song);
      })
      .catch((err) => {
        console.error("Error fetching song:", err);
      })
      .finally(() => setLoading(false));
  }, id);

  if (!song) {
    return navigate("/");
  }
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 p-4">
          <Library />
        </div>
        <div className="col-md-9 p-4">
          <AudioPlayer song={song} />
        </div>
      </div>
    </div>
  );
};

export default SongDetail;
