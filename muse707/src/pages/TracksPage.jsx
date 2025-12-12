import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TrackList from "./TrackList.jsx";
import SearchBar from "../components/SearchBar.jsx";
import "./TracksPage.css";
import M707logo from "../assets/M707logo.png"; 

const TracksPage = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const fetchAllTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:4000/api/tracks');
      setTracks(response.data);
      setIsSearching(false);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError('Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/tracks/search?q=${encodeURIComponent(query)}`);
      setTracks(response.data);
      setIsSearching(true);
    } catch (err) {
      console.error('Error searching tracks:', err);
      setError('Failed to search tracks');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    fetchAllTracks();
  };

  useEffect(() => {
    fetchAllTracks();
  }, []);

  const handleAddClick = () => {
    navigate("/tracks/new");
  };

  if (loading) return <div className="tracks-page-loading">Loading...</div>;
  if (error) return <div className="tracks-page-error">{error}</div>;

  return (
    <div className="tracks-page">
      <div className="tracks-page-header">
        <img src={M707logo} alt="M707logo" className="tracks-page-logo" />
        <p className="tracks-page-subtitle">🍓Welcome to Muse707🍓</p>
        <p className="tracks-page-subtitle">Add, search and listen to your favourite tracks</p>
      </div>

      <button onClick={handleAddClick} className="tracks-page-add-btn">
        + Add New Track
      </button>

      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {isSearching && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <button onClick={handleClearSearch} className="tracks-page-back-btn">
            ← Back to All Tracks
          </button>
          <p className="tracks-page-search-results">
            Found {tracks.length} result{tracks.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {tracks.length === 0 ? (
        <p className="tracks-page-no-results">
          {isSearching ? "No tracks found matching your search." : "No tracks yet. Add your first track!"}
        </p>
      ) : (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
};

export default TracksPage;
