import "./movieCard.css";
import { useState } from "react";

const MovieCard = ({
  title,
  posterURL,
  rating,
  movieID,
  overlayFunc,
  popUp,
  setYoutubeURL,
  setWatchedMovies,
  setFavoritedMovies,
  favoritedMovies,
  watchedMovies,
}) => {
  // If a title does not exist, give random title instead
  const trueTitle =
    title === "" || title === null || title === undefined ? "randTitle" : title;
  const handleClick = (event) => {
    event.preventDefault();
    getDetails();
    popUp(true);
  };

  // In case a poster does not exist for a movie, give a lorem ipsum title instead
  const poster =
    posterURL === "" ||
    posterURL === null ||
    posterURL === undefined ||
    posterURL.includes("null")
      ? "https://media.istockphoto.com/id/995815438/vector/movie-and-film-modern-retro-vintage-poster-background.jpg?s=612x612&w=0&k=20&c=UvRsJaKcp0EKIuqDKp6S7Dwhltt0D5rbegPkS-B8nDQ="
      : posterURL;

  const [isChecked, setChecked] = useState(() => {
    if (watchedMovies === undefined || watchedMovies.length === 0) {
      return false;
    }
    return watchedMovies.some((self) => self.id === movieID);
  });
  const [isFavorite, setFavorite] = useState(() => {
    if (favoritedMovies === undefined || favoritedMovies.length === 0) {
      return false;
    }
    return favoritedMovies.some((self) => self.id === movieID);
  });

  const handleCheck = (event) => {
    event.stopPropagation();
    if (isChecked === false) {
      setChecked(true);
      setWatchedMovies((self) => [...self, { title: trueTitle, id: movieID }]);
    } else {
      setChecked(false);
      setWatchedMovies((self) =>
        self.filter((v) => {
          return v.title != trueTitle;
        })
      );
    }
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    if (isFavorite === false) {
      setFavorite(true);
      setFavoritedMovies((self) => [
        ...self,
        { title: trueTitle, id: movieID },
      ]);
    } else {
      setFavorite(false);
      setFavoritedMovies((self) =>
        self.filter((v) => {
          return v.title != trueTitle;
        })
      );
    }
  };

  const getDetails = () => {
    let details = "";
    const apiKey = import.meta.env.VITE_BEARER_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`;
    const youtubeURL = `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    };
    // fetch is for DETAILS, needed as no other way to get certain values
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        details = {
          title: json.title,
          backDrop: json.backdrop_path,
          runtime: json.runtime,
          releaseDate: json.release_date,
          genres: json.genres.map((value, index) => {
            if (index != json.genres.length - 1) {
              return value.name + ", ";
            } else {
              return value.name;
            }
          }),
          overview: json.overview,
        };
        overlayFunc(details);
      })
      .catch((err) => console.error(err));
    // using SEARCH of TMDB db.
    fetch(youtubeURL, options)
      .then((res) => res.json())
      .then((json) => {
        // This is just to make sure what we are returning is actually a trialer, because
        // lots of videos were just random yt videos and not the trailers.
        const trailer = json.results.filter((clip) => {
          if (
            clip.type == "Trailer" &&
            clip.name.toLowerCase().includes("trailer") &&
            !clip.name.toLowerCase().includes("vertical")
          ) {
            return true;
          } else {
            return false;
          }
        });
        setYoutubeURL(trailer.at(-1).key);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="movieCard" onClick={handleClick}>
        <img src={poster} alt={`${trueTitle} poster image`} />
        <h3>{trueTitle}</h3>
        <p>Rating: {rating}</p>
        <button id={isFavorite ? "Fav" : "notFav"} onClick={handleFavorite}>
          {" "}
          ★{" "}
        </button>
        <button id={isChecked ? "watched" : "notWatched"} onClick={handleCheck}>
          {" "}
          ✓{" "}
        </button>
      </div>
    </>
  );
};

export default MovieCard;
