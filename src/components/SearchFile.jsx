import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import "./searchFile.css";

const SearchFile = ({
  query,
  nowPlayingChange,
  setSortFunction,
  homeClicked,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    nowPlayingChange(false);
    query(event.target.elements.searchBar.value);
  };

  const [formValue, setFormValue] = useState("Sort");
  const [inputValue, setInputValue] = useState("");

  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleClear = (event) => {
    setInputValue("");
    event.preventDefault();
    homeClicked();
  };

  const handleChange = (event) => {
    event.preventDefault();
    setFormValue(event.target.value);
    setSortFunction(event.target.value);
  };
  return (
    // JSX code to render component.
    <div className="search-container">
      <form onSubmit={handleSubmit} id="seachBar">
        <input
          placeholder="Any Movie or Series"
          name="searchBar"
          value={inputValue}
          onChange={handleChangeInput}
        ></input>
        <button>Submit</button>
        <button onClick={handleClear}> Clear </button>
      </form>
      <form id="sortBar">
        <select value={formValue} onChange={handleChange} name="seach-form">
          <option value="Sort">Sort</option>
          <option value="alphabetic">Alphabetic</option>
          <option value="date-released">Date Released</option>
          <option value="rating">Rating</option>
        </select>
      </form>
    </div>
  );
};

export default SearchFile;
