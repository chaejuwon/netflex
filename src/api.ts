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

// 모달 영화 상세정보
export interface IDetailMovie {
  backdrop_path: string;
  credits: ICredit;
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
  tagline: string;
  release_date: string;
}
// 크레딧 정보
export interface ICredit {
  cast: ICast[];
  crew: ICrew[];
}
export interface ICast {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}
export interface ICrew {
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
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
  credits: ITvCredit;
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
  tagline: string;
  release_date: string;
  first_air_date: string;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    name: string;
    still_path: string;
    overview: string;

  }
}

export interface ISearchTv {
  results: ISearchDetailTv[];
  total_pages: number;
  total_results: number;
}

export interface ISearchDetailTv {
  backdrop_path: string;
  original_language: string;
  original_name: string;
  overview:string
  popularity: number;
  release_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  id: number;
}
// 크레딧 정보
export interface ITvCredit {
  cast: ITvCast[];
  crew: ITvCrew[];
}
export interface ITvCast {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}
export interface ITvCrew {
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
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

// 영화 기본정보, 등장인물 등
export const getDetailMovie = async (movieId: string) => {
  // const response = await axios.get(
  //   `${BASE_URL}/movie/${movieId}?language=ko-KR&api_key=${API_KEY}`
  // );
  // return response.data;
  const [detail, credits] = await Promise.all([
    axios.get(`${BASE_URL}/movie/${movieId}?language=ko-KR&api_key=${API_KEY}`),
    axios.get(`${BASE_URL}/movie/${movieId}/credits?language=ko-KR&api_key=${API_KEY}`)
  ]);
  return {
    ...detail.data,
    credits: credits.data
  };
}

// tv
export const getTvs = async () => {
  const response = await axios.get(
    `${BASE_URL}/discover/tv?language=ko-KR&with_origin_country=KR&origin_country=kr&with_genres=18&api_key=${API_KEY}`
  )
  return response.data;
}

// 카테고리별 tv
export const getCategoryTvs = async (category: string) => {
  let text = "";
  switch (category) {
    case 'on_the_air':
      text = 'first_air_date.desc';
      break;
    case 'popular':
      text = 'popularity.desc';
      break;
    case 'top_rated':
      text = 'vote_average.desc';
      break;
  }
  const response = await axios.get(
    `${BASE_URL}/discover/tv?language=ko-KR&with_origin_country=KR&with_genres=18&first_air_date.gte=2024-01-01&sort_by=${text}&api_key=${API_KEY}`
  )
  return response.data;
}

export const getDetailTv = async (tvId: string) => {
  // const response = await axios.get(
  //   `${BASE_URL}/tv/${tvId}?language=en-US&api_key=${API_KEY}`
  // )
  // return response.data;
  const [detail, credit] = await Promise.all([
    axios.get(`${BASE_URL}/tv/${tvId}?language=ko-KR&api_key=${API_KEY}`),
    axios.get(`${BASE_URL}/tv/${tvId}/credits?language=ko-KR&api_key=${API_KEY}`)
  ])
  return {
    ...detail.data,
    credits: credit.data
  }
}

// 검색 movie
export const getKeyword = async (search: string) => {
  const response = await axios.get(
    `${BASE_URL}/search/movie?query=${search}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`,
  );
  return response.data;
}

// 검색 tv show
export const getKeywordTv = async (search: string) => {
  const response = await axios.get(
    `${BASE_URL}/search/tv?query=${search}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`
  );
  return response.data;
}


