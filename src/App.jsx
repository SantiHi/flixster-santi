import { useState, useEffect } from "react";
import "./App.css";
import SearchFile from "./components/SearchFile.jsx";
import MovieList from "./components/MovieList.jsx";

const App = () => {
  // milestone states
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

  // sidebar States
  const [isVisibleFavorites, setVisibleFavorites] = useState(false);
  const [isVisibleWatched, setVisibleWatched] = useState(false);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [favoritedMovies, setFavoritedMovies] = useState([]);

  useEffect(() => {
    if (searchQuery != "" && searchQuery != null && searchQuery != null) {
      handleResults([]);
      fetchSearch(searchQuery, false, false);
    } else {
      setNowPlaying(true);
      setPageNumber(1);
      fetchSearch("", false, false);
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
      fetchSearch(searchQuery, false, false);
    }
  }, [pageNumber]);

  const fetchSearch = (query, favorite, watched) => {
    const apiKey = import.meta.env.VITE_BEARER_KEY;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };

    if (favorite === true) {
      doManySmallSearches(options, true);
    } else if (watched === true) {
      doManySmallSearches(options, false);
    } else {
      doLargeSearch(query, options);
    }
  };

  const doManySmallSearches = (options, favorite) => {
    // for searches that will return a single movie dict, grouped as is handled similarly
    let idArray = [];
    if (favorite === true) {
      idArray = favoritedMovies.map((value) => {
        return value.id;
      });
    } else {
      idArray = watchedMovies.map((value) => {
        return value.id;
      });
    }

    idArray = idArray.map((value) => {
      return `https://api.themoviedb.org/3/movie/${value}?language=en-US`;
    });
    Promise.all(
      idArray.map((url) => {
        return fetch(url, options).then((res) => res.json());
      })
    ).then((results) => {
      handleResults(results);
    });
  };

  const doLargeSearch = (query, options) => {
    // for searches that will return array of movies, instead of detials on a single movie. Grouped as they have similar format.
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

  const handleFavClick = () => {
    fetchSearch("", true, false);
  };

  const handleWatchedClick = () => {
    fetchSearch("", false, true);
  };

  const homeClicked = (event) => {
    if (searchQuery === "") {
      handleSearch("now-playing");
    } else {
      handleSearch("");
    }
    setNowPlaying(true);
  };

  return (
    <div className="App">
      <header>
        <h1>Flixster</h1>
      </header>
      <main className="body-container">
        <nav className="sidebar">
          <div id="buttons">
            <button onClick={homeClicked} id="home1">
              {" "}
              ⌂{" "}
            </button>
            <button
              id="favorite"
              onMouseEnter={() => setVisibleFavorites(true)}
              onMouseLeave={() => setVisibleFavorites(false)}
              onClick={handleFavClick}
            >
              {" "}
              ★{" "}
            </button>
            {isVisibleFavorites &&
              favoritedMovies.map((value) => {
                return (
                  <p key={value.id} id="favorite-text">
                    {value.title}
                  </p>
                );
              })}
            <button
              id="watched"
              onMouseEnter={() => setVisibleWatched(true)}
              onMouseLeave={() => setVisibleWatched(false)}
              onClick={handleWatchedClick}
            >
              {" "}
              ✓{" "}
            </button>
            {isVisibleWatched &&
              watchedMovies.map((value) => {
                return (
                  <p key={value.id} id="watched-text">
                    {value.title}
                  </p>
                );
              })}
          </div>
        </nav>
        <div id="non-searchbar">
          <SearchFile
            query={handleSearch}
            nowPlayingChange={setNowPlaying}
            setSortFunction={setSortFunction}
            homeClicked={homeClicked}
          />
          {isPopup && (
            <>
              <div className="modal-overlay2">
                <div className="movie-details">
                  <h3>{details.title}</h3>
                  <img
                    src={`https://image.tmdb.org/t/p/w400${details.backDrop}`}
                    alt={`${details.title} backdrop image`}
                  />
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
          <h3 id="banner">Find Your Movies</h3>
          <MovieList
            results={searchResults}
            showOverlay={setMovieDetails}
            popUp={setPopup}
            sortFunction={sortFunction}
            setYoutubeURL={setYoutubeURL}
            setWatchedMovies={setWatchedMovies}
            setFavoritedMovies={setFavoritedMovies}
            favoritedMovies={favoritedMovies}
            watchedMovies={watchedMovies}
          />
          {searchResults.length >= 20 && (
            <button
              id="more-button"
              onClick={() => {
                setPageNumber((self) => self + 1);
              }}
            >
              Load More
            </button>
          )}
        </div>
        <div className="sidebar-right"></div>
      </main>
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
