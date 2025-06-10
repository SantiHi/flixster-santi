import MovieCard from "./MovieCard";
import "./movieList.css";

const MovieList = (movieList) => {
  const results = movieList.results;
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
              />
            );
          })}
        </div>
      </div>
    );
  }
};

export default MovieList;
