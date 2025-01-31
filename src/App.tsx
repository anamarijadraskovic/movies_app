import { FormEvent, useEffect, useState } from "react";
import filmLogo from "./assets/film.svg";
import "./App.css";
import { fetchMovies, MoviesResponse } from "./api/getMovies.ts";
import { Genre, getGenres } from "./api/getGenres.ts";
import { Loader } from "./components/Loader/Loader.tsx";
import { getMoviesByGenre } from "./api/getMoviesByGenre.ts";
import { MovieCard } from "./components/MovieCard/MovieCard.tsx";

function App() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [groupedMovies, setGroupedMovies] = useState<
    Record<number, MoviesResponse>
  >({});
  const [focusedMovie, setFocusedMovie] = useState<{
    genreId: number;
    index: number;
  } | null>(null);

  const [query, setQuery] = useState<string>("");
  const [scrollSinceMove, setScrollSinceMove] = useState<number>(0);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const results = await fetchMovies(query);
    if (results) setGroupedMovies(results);
    else console.error("Error searching for movies:");
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      const genreResponse = await getGenres();
      if (!genreResponse) {
        setGenresLoading(false);
        return;
      }

      setGenres(genreResponse.genres);

      const moviesByGenre: Record<number, MoviesResponse> = {};

      for (const genre of genreResponse.genres) {
        const movies = await getMoviesByGenre(genre.id);
        console.log(movies);
        if (movies) {
          moviesByGenre[genre.id] = movies;
        }
      }

      setGroupedMovies(moviesByGenre);
      setGenresLoading(false);
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!focusedMovie) return;
      event.preventDefault();

      const { genreId, index } = focusedMovie;
      const moviesList = groupedMovies[genreId]?.results || [];

      let newIndex = index;
      let newGenreId = genreId;

      if (event.key === "ArrowRight") {
        newIndex = Math.min(index + 1, moviesList.length - 1);
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        newIndex = Math.max(index - 1, 0);
        event.preventDefault();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();

        const nextGenreIndex = genres.findIndex((g) => g.id === genreId) + 1;
        if (nextGenreIndex < genres.length) {
          newGenreId = genres[nextGenreIndex].id;
          newIndex = focusedMovie.index;
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();

        const prevGenreIndex = genres.findIndex((g) => g.id === genreId) - 1;
        if (prevGenreIndex >= 0) {
          newGenreId = genres[prevGenreIndex].id;
          newIndex = focusedMovie.index;
        }
      }

      setFocusedMovie({ genreId: newGenreId, index: newIndex });

      document
        .querySelector(`#movie-${newGenreId}-${newIndex}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedMovie, groupedMovies, genres]);

  useEffect(() => {
    const el = document.querySelector("main");
    if (!el) return;
    el.onwheel = (e) => {
      setScrollSinceMove((prev) => prev + e.deltaY);
    };
  }, []);

  useEffect(() => {
    if (!focusedMovie) return;
    if (scrollSinceMove < 240 && scrollSinceMove > -240) return;

    if (scrollSinceMove >= 240) {
      const { genreId, index } = focusedMovie;

      let newIndex = index;
      let newGenreId = genreId;
      const nextGenreIndex = genres.findIndex((g) => g.id === genreId) + 1;
      if (nextGenreIndex < genres.length) {
        newGenreId = genres[nextGenreIndex].id;
        newIndex = focusedMovie.index;
      }

      setFocusedMovie({ genreId: newGenreId, index: newIndex });
      setScrollSinceMove(0);
    }

    if (scrollSinceMove <= -240) {
      const { genreId, index } = focusedMovie;

      let newIndex = index;
      let newGenreId = genreId;
      const prevGenreIndex = genres.findIndex((g) => g.id === genreId) - 1;
      if (prevGenreIndex >= 0) {
        newGenreId = genres[prevGenreIndex].id;
        newIndex = focusedMovie.index;
      }

      setFocusedMovie({ genreId: newGenreId, index: newIndex });
      setScrollSinceMove(0);
    }
  }, [scrollSinceMove]);

  return (
    <>
      <header>
        <div className="header-logo-container">
          <img src={filmLogo} className="logo" alt="Movie logo" />
          <h1>WATCH</h1>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="i.e. Jurassic Park"
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </form>
      </header>
      <main>
        {genresLoading ? (
          <div className="main-loader-wrapper">
            <Loader />
          </div>
        ) : (
          <>
            {genres.map((genre) => (
              <div key={genre.id} className="genre-container">
                <h2>{genre.name}</h2>
                <ul className="genre-sub-container">
                  {groupedMovies[genre.id]?.results.map((movie, movieIndex) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      movieIndex={movieIndex}
                      genreId={genre.id}
                      focusedMovie={focusedMovie}
                      setFocusedMovie={setFocusedMovie}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}

export default App;
