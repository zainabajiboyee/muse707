import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, onClear }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, artist, mood, or playlist..."
          className="search-bar-input"
        />
        <button type="submit" className="search-bar-btn search-bar-btn-search">
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar-btn search-bar-btn-clear"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
