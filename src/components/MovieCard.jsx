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
  const trueTitle =
    title === "" || title === null || title === undefined ? "randTitle" : title;
  const handleClick = (event) => {
    event.preventDefault();
    getDetails();
    console.log();
    popUp(true);
  };

  const [isChecked, setChecked] = useState(() => {
    if (watchedMovies === undefined || watchedMovies.length === 0) {
      return "check";
    }
    const checked = watchedMovies.some((self) => self.id === movieID);
    if (checked === true) {
      return "check2";
    } else {
      return "check";
    }
  });
  if (movieID === 1376434) {
    console.log(watchedMovies);
  }
  const [isFavorite, setFavorite] = useState(() => {
    if (favoritedMovies === undefined || favoritedMovies.length === 0) {
      return "notFav";
    }
    const Favorite = favoritedMovies.some((self) => self.id === movieID);
    if (Favorite === true) {
      return "Fav";
    } else {
      return "notFav";
    }
  });

  const handleCheck = (event) => {
    event.stopPropagation();
    if (isChecked === "check") {
      setChecked("check2");
      setWatchedMovies((self) => [...self, { title: trueTitle, id: movieID }]);
    } else {
      setChecked("check");
      setWatchedMovies((self) =>
        self.filter((v) => {
          return v.title != trueTitle;
        })
      );
    }
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    if (isFavorite === "notFav") {
      setFavorite("Fav");
      setFavoritedMovies((self) => [
        ...self,
        { title: trueTitle, id: movieID },
      ]);
    } else {
      setFavorite("notFav");
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

    fetch(youtubeURL, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
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
        <img src={posterURL} />
        <h3>{trueTitle}</h3>
        <p>Rating: {rating}</p>
        <button id={isFavorite} onClick={handleFavorite}>
          {" "}
          ★{" "}
        </button>
        <button id={isChecked} onClick={handleCheck}>
          {" "}
          ✓{" "}
        </button>
      </div>
    </>
  );
};

export default MovieCard;
