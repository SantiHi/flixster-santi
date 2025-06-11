import "./movieCard.css";
import { useState } from "react";

const MovieCard = ({
  title,
  posterURL,
  rating,
  movieID,
  overlayFunc,
  popUp,
}) => {
  const trueTitle =
    title === "" || title === null || title === undefined ? "randTitle" : title;

  const handleClick = (event) => {
    event.preventDefault();
    getDetails();
    popUp(true);
  };

  const getDetails = () => {
    const apiKey = import.meta.env.VITE_BEARER_KEY;
    const url = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`;
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
        const details = {
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
  };

  return (
    <>
      <div className="movieCard" onClick={handleClick}>
        <img src={posterURL} />
        <h3>{trueTitle}</h3>
        <p>Rating: {rating}</p>
      </div>
    </>
  );
};

export default MovieCard;
