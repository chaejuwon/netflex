import axios from "axios";
import { as } from "framer-motion/dist/types.d-B50aGbjN";

const API_KEY = "34e9cb3cbfbd58503ea3d5a964a11559";
const BASE_URL = "https://api.themoviedb.org/3";

// movie
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  name: string;
  original_title: string;
  original_name: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  },
  page: number,
  results: IMovie[],
  total_pages: number,
  total_results: number
}

export interface IKeyword {
  search: string;
}

export interface IDetailMovie {
  backdrop_path: string;
  genres :{
    id: number;
    name: string;
  }[];
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
}
//tv
export interface IGetTvResult {
  total_pages: number;
  results: ITv[];
  total_results: number;
}

export interface ITv {
  backdrop_path: string;
  first_air_date: string
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  id: number;
}

export interface IDetailTv {
  backdrop_path: string;
  genres :{
    id: number;
    name: string;
  }[];
  id: number;
  name: string;
  overview: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

// movie
export const getMovies = async () => {
  const response = await axios.get(
    `${BASE_URL}/movie/now_playing?language=ko-KR&page=1&region=kr&api_key=${API_KEY}`,
  );
  return response.data;
};

export const getCategoryMovies = async (category: string) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${category}?language=ko-KR&page=1&region=kr&api_key=${API_KEY}`
  )
  return response.data;
}

export const getDetailMovie = async (movieId: string) => {
  const response = await axios.get(
    `${BASE_URL}/movie/${movieId}?language=ko-KR&api_key=${API_KEY}`
  );
  return response.data;
}

// tv
export const getTvs = async () => {
  const response = await axios.get(
    `${BASE_URL}/discover/tv?language=ko-KR&with_origin_country=KR&with_genres=18&api_key=${API_KEY}`
  )
  return response.data;
}

// 카테고리별 tv
export const getCategoryTvs = async (category: string) => {
  const response = await axios.get(
    `${BASE_URL}/tv/${category}?language=en-US&page=1&api_key=${API_KEY}`
  )
  return response.data;
}

export const getDetailTv = async (tvId: string) => {
  const response = await axios.get(
    `${BASE_URL}/tv/${tvId}?language=en-US&api_key=${API_KEY}`
  )
  return response.data;
}

// 검색
export const getKeyword = async (search: string) => {
  const response = await axios.get(
    `${BASE_URL}/search/multi?query=${search}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`,
  );
  return response.data;
}


