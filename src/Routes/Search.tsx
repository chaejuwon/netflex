import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getKeyword,
  getKeywordTv,
  getMovies,
  IGetMovieResult,
  IKeyword, ISearchTv,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { useEffect } from "react";
import images from "../images/no_image.jpg";
import Footer from "../components/common/Footer";

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin:0 auto;
  padding-top:80px;
`;

const MovieTitle = styled.div`
  font-size:48px;
`;

const SearchWrap = styled.div`
  padding-top:40px;
  display: grid;
  gap:5px;
  grid-template-columns: repeat(5, 1fr);
`;

const SearchItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border:1px solid #fff;
`;

const Img = styled.img`
  width: 100%;
`;

const Title = styled.h2`
  font-size:16px;
  padding:15px;
  text-align: center;
`;

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");

  const { data: movieData, isLoading: movieIsLoading } = useQuery<IGetMovieResult>({
    queryKey: ["searchMovie", search],
    queryFn: () => getKeyword(search as string),
    enabled: !!search
  });
  const {data: tvData, isLoading: tvIsLoading} = useQuery<ISearchTv>({
    queryKey: ["searchTv", search],
    queryFn: () => getKeywordTv(search as string),
    enabled: !!search
  })
  // console.log('movie', movieData);
  console.log('tv', tvData);

  return (
    <>
      <Wrapper>
        <MovieTitle>"{search}"의 영화 검색결과</MovieTitle>
        <SearchWrap>
          {movieIsLoading ? "isLoading..." : (
            movieData?.results.slice(0, 10).map((movie) => (
              <SearchItem key={movie.id}>
                {movie.backdrop_path ? <Img src={makeImagePath(movie.backdrop_path)} /> : <Img src={images} />}

                <Title>{movie.title}</Title>
              </SearchItem>
            ))
          )}
        </SearchWrap>
        <MovieTitle>"{search}"의 티비쇼 검색결과</MovieTitle>
        <SearchWrap>
          {tvIsLoading ? "...isTvLoading" : (
            tvData?.results.slice(0, 10).map((tv) => (
              <SearchItem key={tv.id}>
                {tv.backdrop_path ? <Img src={makeImagePath(tv.backdrop_path)} /> : <Img src={images} />}
                <Title>{tv.original_name}</Title>

              </SearchItem>
            ))
          )}
        </SearchWrap>
      </Wrapper>
      <Footer />
    </>

  );
}

export default Search;