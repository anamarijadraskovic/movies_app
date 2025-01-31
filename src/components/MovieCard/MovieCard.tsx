import React from "react";
import { Movie } from "../../api/getMovies";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  movieIndex: number;
  genreId: number;
  focusedMovie: { genreId: number; index: number } | null;
  setFocusedMovie: (focus: { genreId: number; index: number }) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  movieIndex,
  genreId,
  focusedMovie,
  setFocusedMovie,
}) => {
  const movieCardClassName = `movie-card ${focusedMovie?.genreId === genreId && focusedMovie?.index === movieIndex ? "focused" : ""}`;

  return (
    <li
      id={`movie-${genreId}-${movieIndex}`}
      tabIndex={0}
      className={movieCardClassName}
      onClick={() => setFocusedMovie({ genreId, index: movieIndex })}
    >
      <img
        className="movie-card-image"
        src={`https://image.tmdb.org/t/p/w200/${movie.backdrop_path}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
    </li>
  );
};
