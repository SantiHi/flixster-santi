import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import "./searchFile.css";

const SearchFile = ({ query, nowPlayingChange, setSortFunction }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    nowPlayingChange(false);
    query(event.target.elements.searchBar.value);
  };

  const [formValue, setFormValue] = useState("alphabetic");

  const handleNowPlaying = (event) => {
    event.preventDefault();
    query("now-playing");
    nowPlayingChange(true);
  };

  const handleClear = (event) => {
    event.preventDefault();
    query("");
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormValue(event.target.value);
    setSortFunction(event.target.value);
  };
  return (
    // JSX code to render component.
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input placeholder="Any Movie or Series" name="searchBar"></input>
        <button>Submit</button>
        <button onClick={handleClear}> Clear </button>
        <button onClick={handleNowPlaying}>Now Playing</button>
      </form>
      <form>
        <select value={formValue} onChange={handleChange} name="seach-form">
          <option value="alphabetic">alphabetic</option>
          <option value="date-released">Date Released</option>
          <option value="rating">Rating</option>
        </select>
      </form>
    </div>
  );
};

export default SearchFile;
