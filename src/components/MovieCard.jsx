import "./movieCard.css";

const MovieCard = ({ title, posterURL, rating }) => {
  const tempTitle =
    title === "" || title === null || title === undefined ? "randTitle" : title;

  return (
    <div className="movieCard">
      <img src={posterURL} />
      <h3>{tempTitle}</h3>
      <p>Rating: {rating}</p>
    </div>
  );
};

export default MovieCard;
