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
  apiKey: string,
): Promise<MoviesResponse> {
  if (!query) {
    throw new Error("Query cannot be empty");
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
    query,
  )}&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching movies: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results; // Return the array of movies
  } catch (error) {
    console.error("Error in fetchMovies:", error);
    throw error;
  }
}
