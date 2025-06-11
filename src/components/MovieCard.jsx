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
}) => {
  const trueTitle =
    title === "" || title === null || title === undefined ? "randTitle" : title;

  const handleClick = (event) => {
    event.preventDefault();
    getDetails();
    console.log();
    popUp(true);
  };

  const [isChecked, setChecked] = useState("check");
  const [isFavorite, setFavorite] = useState("notFav");

  const handleCheck = (event) => {
    event.stopPropagation();
    if (isChecked === "check") {
      setChecked("check2");
    } else {
      setChecked("check");
    }
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    if (isFavorite === "notFav") {
      setFavorite("Fav");
    } else {
      setFavorite("notFav");
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
            clip.official === true &&
            !clip.name.toLowerCase().includes("vertical")
          ) {
            return true;
          } else {
            return false;
          }
        });
        console.log(trailer.at(-1).key);
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
