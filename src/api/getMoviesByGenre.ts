import { API_KEY, dbBaseUrl } from "../constants";

export const getMoviesByGenre = async (genreId: number) => {
  try {
    const url = `${dbBaseUrl}discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    return null;
  }
};
