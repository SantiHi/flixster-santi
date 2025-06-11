import MovieCard from "./MovieCard";
import "./movieList.css";

const MovieList = ({ results, showOverlay, popUp }) => {
  if (results) {
    return (
      <div>
        <div className="movie-list">
          {results.map((value, index) => {
            return (
              <MovieCard
                key={index}
                posterURL={`https://image.tmdb.org/t/p/w400${value.poster_path}`}
                title={value.title}
                rating={value.vote_average}
                movieID={value.id}
                overlayFunc={showOverlay}
                popUp={popUp}
              />
            );
          })}
        </div>
      </div>
    );
  }
};

export default MovieList;
