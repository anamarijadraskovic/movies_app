import { Movie } from "../../types/movieTypes";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  row: number;
  col: number;
  movieCardWidth: number;
  focusedMovie: { row: number; col: number } | null;
  setFocusedMovie: (focus: { row: number; col: number }) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  row,
  col,
  movieCardWidth,
  focusedMovie,
  setFocusedMovie,
  onKeyDown,
}) => {
  const isFocused = focusedMovie?.row === row && focusedMovie?.col === col;
  const movieCardClassName = `movie-card ${isFocused ? "focused" : ""}`;

  if (isFocused) {
    document.getElementById(`movie-${row}-${col}`)?.focus();
  }

  return !movie.backdrop_path ? null : (
    <li
      id={`movie-${row}-${col}`}
      tabIndex={0}
      className={movieCardClassName}
      onClick={() => setFocusedMovie({ row: row, col: col })}
      onKeyDown={(e) => onKeyDown(e)}
      style={{ minWidth: `${movieCardWidth}px` }}
    >
      <img
        className="movie-card-image"
        src={`https://image.tmdb.org/t/p/w200/${movie.backdrop_path}`}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title.slice(0, 20)}</h3>
    </li>
  );
};
