import { useEffect, useState } from "react";
import filmLogo from "./assets/film.svg";
import "./App.css";
import { fetchMovies, MoviesResponse } from "./api/getMovies.ts";

function App() {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<MoviesResponse>({ results: [] });
  const API_KEY = "3c1a768f88d6d295711b2e22a860387b";

  const fetchInitialMovies = async () => {
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`;
      const response = await fetch(url);
      const results = await response.json();
      setMovies(results);
    } catch (error) {
      console.error("Error fetching initial movies:", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await fetchMovies(query, API_KEY);
      setMovies(results);
    } catch (error) {
      console.error("Error searching for movies:", error);
    }
  };

  // Fetch initial action movies on mount
  useEffect(() => {
    fetchInitialMovies();
  }, []);

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
        <ul>
          {movies.results.map((movie) => (
            <li key={movie.id}>
              <img
                className="card--image"
                src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`}
                alt={movie.title + " poster"}
              />
              <h3>{movie.title}</h3>
              <p>Release Date: {movie.release_date}</p>
              <p>{movie.overview}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export default App;
