export interface Genre {
  id: number;
  name: string;
}

export interface GenreWithRow extends Genre {
  rowNum: number;
}

export type GenreResponse = {
  genres: Genre[];
};
