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
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    let url = "";
    if (!isNowPlaying) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${pageNumber}`;
    } else {
      url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&page=${pageNumber}`;
    }
    console.log(url);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOThmYzVlOGE2NTkxMGM4MDBlMmZiNzNkODg5OThkMiIsIm5iZiI6MTc0OTUwMzI5NC40NDQsInN1YiI6IjY4NDc0ZDNlMGVlN2UwYjY2MjM0MmE3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DV444EvRYNiCIedU2Es21YwzLWoov9JP9thnXmzead0",
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
      <MovieList results={searchResults} />
      <button
        id="more-button"
        onClick={() => {
          setPageNumber((self) => self + 1);
        }}
      >
        {" "}
        Load More
      </button>
    </div>
  );
};

export default App;
