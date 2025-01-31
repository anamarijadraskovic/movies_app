import { dbBaseUrl } from "../constants";

export type Genre = {
  id: number;
  name: string;
};

export type GenreResponse = {
  genres: Genre[];
};

export async function getGenres(): Promise<GenreResponse | null> {
  const url = `${dbBaseUrl}genre/movie/list?language=en`;
  const bearerToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzFhNzY4Zjg4ZDZkMjk1NzExYjJlMjJhODYwMzg3YiIsIm5iZiI6MTczODA4MjA4MC40NTgsInN1YiI6IjY3OTkwNzIwYTZlNDEyODNmMTJiNzBhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2fDssb0IUWpjVcv8-afA_c-5vzmWWj-uYIBy8xUY2hQ";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return null;
  }
}
