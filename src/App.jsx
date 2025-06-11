import { useState, useEffect } from "react";
import "./App.css";
import SearchFile from "./components/SearchFile.jsx";
import MovieList from "./components/MovieList.jsx";

const App = () => {
  const [searchQuery, handleSearch] = useState("");
  const [searchResults, handleResults] = useState([]);
  const [loadedResults, handleLoadedResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isNowPlaying, setNowPlaying] = useState(true);
  const [sortFunction, setSortFunction] = useState("Sort");
  const [youtubeURL, setYoutubeURL] = useState("");
  //Overlay States
  const [details, setMovieDetails] = useState([]);
  const [isPopup, setPopup] = useState(false);

  useEffect(() => {
    if (searchQuery != "" && searchQuery != null && searchQuery != null) {
      fetchSearch(searchQuery);
    } else {
      setNowPlaying(true);
      setPageNumber(1);
      fetchSearch("");
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
      url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageNumber}`;
    }
    if (query === "") {
      url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageNumber}`;
    }
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

  const handleClickModal = () => {
    setPopup(false);
  };

  return (
    <div className="App">
      <header>
        <h2>Flixster</h2>
        <div id="search-sort"></div>
        <SearchFile
          query={handleSearch}
          nowPlayingChange={setNowPlaying}
          setSortFunction={setSortFunction}
        />
      </header>
      {isPopup && (
        <>
          <div className="modal-overlay2">
            <div className="movie-details">
              <h3>{details.title}</h3>
              <img src={`https://image.tmdb.org/t/p/w400${details.backDrop}`} />
              <h3> {details.runtime} minutes</h3>
              <h3> Release Date: {details.releaseDate} </h3>
              <h3> {details.genres}</h3>
              <h3> Overview: {details.overview}</h3>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeURL}`}
              ></iframe>
              <button onClick={handleClickModal}>Close</button>
            </div>
          </div>
        </>
      )}
      <MovieList
        results={searchResults}
        showOverlay={setMovieDetails}
        popUp={setPopup}
        sortFunction={sortFunction}
        setYoutubeURL={setYoutubeURL}
      />
      <button
        id="more-button"
        onClick={() => {
          setPageNumber((self) => self + 1);
        }}
      >
        Load More
      </button>

      <footer>
        <h4> © 2025 Santiago Criado |</h4>
        <a href="https://github.com/SantiHi/flixster-starter" target="_blank">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
