import MovieCard from "./MovieCard";
import "./movieList.css";
import { v4 as uuidv4 } from "uuid";

const MovieList = ({
  results,
  showOverlay,
  popUp,
  sortFunction,
  setYoutubeURL,
  setWatchedMovies,
  setFavoritedMovies,
  favoritedMovies,
  watchedMovies,
}) => {
  const sort = (sortingFunc) => {
    if (sortingFunc === "Sort") {
      return;
    }
    if (sortingFunc === "alphabetic") {
      // lexographically by name of playlist
      results.sort((a, b) => compareTitle(a, b));
    } else if (sortingFunc === "rating") {
      // by number of likes (descending)
      results.sort((a, b) => compareRating(a, b));
    } else {
      // sort by date
      results.sort((a, b) => compareDate(a, b));
    }
  };

  const compareTitle = (movie1, movie2) => {
    const title1 = movie1.title;
    const title2 = movie2.title;
    if (title2 > title1) {
      return -1;
    } else if (title2 < title1) {
      return 1;
    } else {
      return compareRating(movie1, movie2);
    }
  };

  const compareRating = (movie1, movie2) => {
    // names lexographically
    const likes1 = movie1.vote_average;
    const likes2 = movie2.vote_average;
    if (likes1 >= likes2) return -1;
    return 1;
  };

  const compareDate = (movie1, movie2) => {
    let date1 = new Date(movie1.release_date);
    let date2 = new Date(movie2.release_date);
    if (date2 >= date1) return 1;
    return -1;
  };
  if (results) {
    sort(sortFunction);
    return (
      <div>
        <div className="movie-list">
          {results.map((value, index) => {
            return (
              <MovieCard
                key={uuidv4()}
                posterURL={`https://image.tmdb.org/t/p/w400${value.poster_path}`}
                title={value.title}
                rating={value.vote_average}
                movieID={value.id}
                overlayFunc={showOverlay}
                popUp={popUp}
                setYoutubeURL={setYoutubeURL}
                setFavoritedMovies={setFavoritedMovies}
                setWatchedMovies={setWatchedMovies}
                favoritedMovies={favoritedMovies}
                watchedMovies={watchedMovies}
              />
            );
          })}
        </div>
      </div>
    );
  }
};

export default MovieList;
