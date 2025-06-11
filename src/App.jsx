import { useState, useEffect } from "react";
import "./App.css";
import SearchFile from "./components/SearchFile.jsx";
import MovieList from "./components/MovieList.jsx";
import { unstable_renderSubtreeIntoContainer } from "react-dom";

const App = () => {
  const [searchQuery, handleSearch] = useState("");
  const [searchResults, handleResults] = useState([]);
  const [loadedResults, handleLoadedResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isNowPlaying, setNowPlaying] = useState(false);

  //Overlay States
  const [details, setMovieDetails] = useState([]);
  const [isPopup, setPopup] = useState(false);

  //overlay check

  useEffect(() => {
    console.log(searchQuery);
    if (searchQuery) {
      fetchSearch(searchQuery);
    } else {
      setPageNumber(1);
      handleResults([]);
    }
  }, [searchQuery]);

  //concat the search results and the next page.
  useEffect(() => {
    if (loadedResults) {
      handleResults([...searchResults, ...loadedResults]);
    }
  }, [loadedResults]);

  useEffect(() => {
    if (pageNumber > 1) {
      fetchSearch(searchQuery);
    }
  }, [pageNumber]);

  const fetchSearch = (query) => {
    const apiKey = import.meta.env.VITE_BEARER_KEY;
    let url = "";
    if (!isNowPlaying) {
      url = `https://api.themoviedb.org/3/search/movie?&query=${encodeURIComponent(
        query
      )}&page=${pageNumber}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/now_playing?&query=${encodeURIComponent(
        query
      )}&page=${pageNumber}`;
    }
    console.log(url);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        if (pageNumber <= 1) {
          handleResults(json.results);
        } else {
          handleLoadedResults(json.results);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <header>
        <h2>Flixster</h2>
        <div id="search-sort"></div>
        <SearchFile query={handleSearch} nowPlayingChange={setNowPlaying} />
      </header>
      <MovieList
        results={searchResults}
        showOverlay={setMovieDetails}
        popUp={setPopup}
      />
      <button
        id="more-button"
        onClick={() => {
          setPageNumber((self) => self + 1);
        }}
      >
        Load More
      </button>
      {isPopup && console.log(details) && (
        <>
          <div className="modal-overlay"></div>
          <div className="info-modal">
            <h3>{details.title}</h3>
            <img src={`https://image.tmdb.org/t/p/w400${details.backDrop}`} />
            <h3> Release Date: {details.releaseDate} </h3>
            <h3> Overview: {details.overview}</h3>
            <button> Close </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
