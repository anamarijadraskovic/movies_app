import { FormEvent, useEffect, useState } from "react";
import filmLogo from "./assets/film.svg";
import "./App.css";
import { fetchMovies, MoviesResponse } from "./api/getMovies.ts";
import { Genre, getGenres } from "./api/GetGenres.ts";

function App() {
  const [scrollSinceMove, setScrollSinceMove] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [groupedMovies, setGroupedMovies] = useState<
    Record<number, MoviesResponse>
  >({});
  const [focusedMovie, setFocusedMovie] = useState<{
    genreId: number;
    index: number;
  } | null>(null);
  const API_KEY = "3c1a768f88d6d295711b2e22a860387b";
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const results = await fetchMovies(query, API_KEY);
    if (results) setGroupedMovies(results);
    else console.error("Error searching for movies:");
  };

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      return null;
    }
  };

  const fetchAllMovies = async () => {
    const genreResponse = await getGenres();
    if (!genreResponse) return;

    setGenres(genreResponse.genres);

    const moviesByGenre: Record<number, MoviesResponse> = {};
    for (const genre of genreResponse.genres) {
      const movies = await fetchMoviesByGenre(genre.id);
      if (movies) {
        moviesByGenre[genre.id] = movies;
      }
    }

    setGroupedMovies(moviesByGenre);
  };

  useEffect(() => {
    fetchAllMovies().then();
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
      console.log("delta: ", e.deltaY);
      setScrollSinceMove(prev => prev + e.deltaY);
    }
  }, [])

  useEffect(() => {
    console.log("scrollsincemove is now", scrollSinceMove)
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

  }, [scrollSinceMove])

  console.log("sum: ", scrollSinceMove);

  return (
    <>
      <header>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <img src={filmLogo} className="logo" alt="Movie logo" />
          <h1>WATCH</h1>
        </div>
        <form className="form" onSubmit={handleSearch}>
          <input
            className="input"
            type="text"
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="i.e. Jurassic Park"
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>
      </header>
      <main>
        {genres.map((genre) => (
          <div key={genre.id} className="genre-container">
            <h2>{genre.name}</h2>
            <div className="genre-sub-container">
              <ul>
                {groupedMovies[genre.id]?.results.map((movie, movieIndex) => (
                  <li
                    key={movie.id}
                    id={`movie-${genre.id}-${movieIndex}`}
                    tabIndex={0}
                    className={
                      focusedMovie?.genreId === genre.id &&
                        focusedMovie?.index === movieIndex
                        ? "focused"
                        : ""
                    }
                    onClick={() =>
                      setFocusedMovie({ genreId: genre.id, index: movieIndex })
                    }
                  >
                    <img
                      className="card-image"
                      src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                    />
                    <h3>{movie.title}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default App;
