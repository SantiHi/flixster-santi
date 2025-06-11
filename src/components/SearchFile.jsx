import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import "./searchFile.css";

const SearchFile = ({ query, nowPlayingChange }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    nowPlayingChange(false);
    query(event.target.elements.searchBar.value);
  };

  const handleNowPlaying = (event) => {
    event.preventDefault();
    query("now-playing");
    nowPlayingChange(true);
  };

  const handleClear = (event) => {
    event.preventDefault();
    query("");
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
    </div>
  );
};

export default SearchFile;
