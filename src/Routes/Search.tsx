import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getKeyword, getMovies, IGetMovieResult, IKeyword } from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { useEffect } from "react";

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
  padding:20px;
  text-align: center;
`;

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["search", search],
    queryFn: () => getKeyword(search as string),
    enabled: !!search
  });
  //test
  return (
    <Wrapper>
      <MovieTitle>Movies</MovieTitle>
      <SearchWrap>
        {isLoading ? "isLoading..." : (
          data?.results.slice(0, 10).map((movie) => (
            <SearchItem key={movie.id}>
              <Img src={makeImagePath(movie.backdrop_path)} />
              <Title>{movie.original_name}</Title>
            </SearchItem>
          ))
        )}
      </SearchWrap>

    </Wrapper>
  );
}

export default Search;