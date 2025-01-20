import React, { useEffect, useState } from "react";
import {
  getSongsApi,
  getTopArtistsApi,
  getTrendingSongsApi,
} from "../../apis/Api";
import Library from "../../components/Library";
import HeroSlider from "../../components/HeroSlider";
import HomePageSection from "../../components/HomePageSection";

const Homepage = () => {
  const authToken = localStorage.getItem("token");

  const [topArtists, setTopArtists] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, trendingRes, songsRes] = await Promise.all([
          getTopArtistsApi(),
          getTrendingSongsApi(1), //static page number for now
          getSongsApi(1), //static page number for now
        ]);

        setTopArtists(artistsRes.data.data.artist);
        setTrendingSongs(trendingRes.data.data.song);
        setRecommendedSongs(songsRes.data.data.song);
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-3 p-4">
          <Library />
        </div>
        <div className="col-md-9 p-4">
          <HeroSlider items={recommendedSongs} />
          <HomePageSection
            title="Trending Songs"
            items={trendingSongs}
            type="song"
          />
          <HomePageSection
            title="Top Artists"
            items={topArtists}
            type="artist"
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
