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
import { useEffect, useState } from "react";
import images from "../images/no_image.jpg";
import Footer from "../components/common/Footer";
import { device } from "../media";

const Mt50 = styled.div`
  margin-top:100px;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin:80px auto 50px;
  @media ${device.mobile} {
    padding:0 15px;
  }
`;

const MovieTitle = styled.div`
  font-size:48px;
`;

const SearchWrap = styled.div`
  padding-top:30px;
  display: grid;
  gap:10px;
  grid-template-columns: repeat(5, 1fr);
  @media ${device.mobile} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SearchItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border:1px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
`;

const Img = styled.img`
  width: 100%;
  max-height: 129px;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size:16px;
  padding:15px;
  text-align: center;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");
  const [offset, setOffset] = useState(10);

  useEffect(() => {
    const updateOffset = () => {
      const width = window.innerWidth;

      if(width <= 768) {
        setOffset(6);
      } else {
        setOffset(10);
      }
    }

    updateOffset();
    window.addEventListener("resize", updateOffset);

    return () => window.removeEventListener("resize", updateOffset);
  },[]);

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
            movieData?.results.slice(0, offset).map((movie) => (
              <SearchItem key={movie.id}>
                {movie.backdrop_path ? <Img src={makeImagePath(movie.backdrop_path)} /> : <Img src={images} />}

                <Title>{movie.title}</Title>
              </SearchItem>
            ))
          )}
        </SearchWrap>
        <Mt50>
          <MovieTitle>"{search}"의 티비프로그램 검색결과</MovieTitle>
          <SearchWrap>
            {tvIsLoading ? "...isTvLoading" : (
              tvData?.results.slice(0, offset).map((tv) => (
                <SearchItem key={tv.id}>
                  {tv.backdrop_path ? <Img src={makeImagePath(tv.backdrop_path)} /> : <Img src={images} />}
                  <Title>{tv.original_name}</Title>

                </SearchItem>
              ))
            )}
          </SearchWrap>
        </Mt50>
      </Wrapper>
      <Footer />
    </>

  );
}

export default Search;