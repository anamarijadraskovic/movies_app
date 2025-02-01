import { useEffect, useState } from "react";

import "./App.css";
import { getGenres } from "./api/getGenres.ts";
import { getMoviesByGenre } from "./api/getMoviesByGenre.ts";
import filmLogo from "./assets/film.svg";
import { Loader } from "./components/Loader/Loader.tsx";
import { MovieCard } from "./components/MovieCard/MovieCard.tsx";
import { headerHeight } from "./constants.ts";
import { getCardWidth, getRowHeight, handleKeyNavigation } from "./helpers.ts";
import { GenreWithRow } from "./types/genreTypes.ts";
import { MoviesResponse } from "./types/movieTypes.ts";

function App() {
  const [genres, setGenres] = useState<GenreWithRow[]>([]);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [groupedMovies, setGroupedMovies] = useState<MoviesResponse[]>([]);
  const [focusedMovie, setFocusedMovie] = useState<{
    row: number;
    col: number;
  } | null>({ row: 0, col: 0 });
  const [scrollSinceMove, setScrollSinceMove] = useState<number>(0);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const genreResponse = await getGenres();
      if (!genreResponse) {
        setGenresLoading(false);
        return;
      }

      const genresWithRowNum = genreResponse.genres.map((genre, i) => {
        return { ...genre, rowNum: i };
      });

      const moviesByGenre: MoviesResponse[] = [];
      for (const genre of genresWithRowNum) {
        const movies = await getMoviesByGenre(genre.id);
        if (movies) {
          moviesByGenre[genre.rowNum] = movies;
        }
      }

      setGenres(genresWithRowNum);
      setGroupedMovies(moviesByGenre);
      setGenresLoading(false);
    };

    fetchAllMovies();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (!focusedMovie) return;
    event.preventDefault();

    let { row, col } = focusedMovie;
    const moviesList = groupedMovies[row]?.results || [];

    let res = handleKeyNavigation(
      event,
      row,
      col,
      groupedMovies.length,
      moviesList.length,
    );

    setFocusedMovie({ row: res.row, col: res.col });
  };

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    main.onwheel = (event: WheelEvent) => {
      setScrollSinceMove((prev) => prev + event.deltaY);
    };
  }, []);

  const rowHeight = getRowHeight();
  const cardWidth = getCardWidth();

  useEffect(() => {
    if (!focusedMovie) return;

    const halfRowHeight = rowHeight / 2;
    if (scrollSinceMove < halfRowHeight && scrollSinceMove > -halfRowHeight)
      return;

    if (scrollSinceMove >= halfRowHeight) {
      let { row, col } = focusedMovie;
      row = Math.min(row + 1, genres.length - 1);
      setFocusedMovie({ row, col });
    } else if (scrollSinceMove <= -halfRowHeight) {
      let { row, col } = focusedMovie;
      row = Math.max(row - 1, 0);
      setFocusedMovie({ row, col });
    }

    setScrollSinceMove(0);
  }, [scrollSinceMove]);

  return (
    <>
      <header style={{ height: `${headerHeight}px` }}>
        <div className="header-logo-container">
          <img src={filmLogo} className="logo" alt="Movie logo" />
          <h1>WATCH</h1>
        </div>
      </header>
      <main>
        {genresLoading ? (
          <div className="main-loader-wrapper">
            <Loader />
          </div>
        ) : (
          genres.map((genre) => (
            <div
              key={genre.id}
              className="genre-container"
              style={{ height: `${rowHeight}px` }}
            >
              <h2>{genre.name}</h2>
              <ul className="genre-sub-container">
                {groupedMovies[genre.rowNum]?.results.map(
                  (movie, movieIndex) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      row={genre.rowNum}
                      col={movieIndex}
                      movieCardWidth={cardWidth}
                      focusedMovie={focusedMovie}
                      setFocusedMovie={setFocusedMovie}
                      onKeyDown={handleKeyDown}
                    />
                  ),
                )}
              </ul>
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default App;
