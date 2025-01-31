import { API_KEY, dbBaseUrl } from "../constants";

export type Movie = {
  popularity: number;
  vote_count: number;
  video: boolean;
  poster_path: string | null;
  id: number;
  adult: boolean;
  backdrop_path: string | null;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  title: string;
  vote_average: number;
  overview: string;
  release_date: string | null;
};

export type MoviesResponse = {
  page: number;
  total_results: number;
  total_pages: number;
  results: Movie[];
};

export async function fetchMovies(
  query: string,
): Promise<MoviesResponse | null> {
  if (!query) {
    throw new Error("Query cannot be empty");
  }

  const url = `${dbBaseUrl}search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query,
  )}&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchMovies:", error);
    return null;
  }
}
