import axios from 'axios';
import { iMovie, iVideo } from '../models/Movie';

const API_KEY  = 'b1cc4f0e17f6986b0d0bb2c3385c4e91'; //Jag vet..
const BASE_URL = 'https://api.themoviedb.org/3';

export type GenreMap = Record<number, string>;

export const fetchGenreMap = async (): Promise<GenreMap> => {
  const { data } = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: { api_key: API_KEY, language: 'en-US' },
  });

  const map: GenreMap = {};
  data.genres.forEach((g: { id: number; name: string }) => {
    map[g.id] = g.name;
  });
  return map;
};

const transformMovie = (movie: any, genreMap: GenreMap): iMovie => ({
  id: movie.id,
  title: movie.title,
  poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
  description: movie.overview,
  genre: genreMap[movie.genre_ids?.[0]] || 'Unknown',
  year: movie.release_date?.split('-')[0] || '',
  rating: movie.vote_average.toFixed(1),
});

export const fetchPopularMovies = async (
  genreMap: GenreMap,
): Promise<iMovie[]> => {
  const { data } = await axios.get(`${BASE_URL}/movie/popular`, {
    params: { api_key: API_KEY, language: 'en-US', page: 1 },
  });
  return data.results.map((m: any) => transformMovie(m, genreMap));
};

export const fetchTrendingMovies = async (
  genreMap: GenreMap,
): Promise<iMovie[]> => {
  const { data } = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: API_KEY },
  });
  return data.results.map((m: any) => transformMovie(m, genreMap));
};

export const fetchMovieVideos = async (
  movieId: number,
): Promise<iVideo[]> => {
  const { data } = await axios.get(
    `${BASE_URL}/movie/${movieId}/videos`,
    { params: { api_key: API_KEY, language: 'en-US' } },
  );
  return data.results as iVideo[];
};