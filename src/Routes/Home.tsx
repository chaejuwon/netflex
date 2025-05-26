import { useQuery } from "@tanstack/react-query";
import {
  getMovies,
  IGetMovieResult,
  getDetailMovie,
  IDetailMovie,
} from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SliderAll from "../components/home/Slider";
import Footer from "../components/common/Footer";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${props => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 72px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 20px;
  line-height: 120%;
  width: 70%;
`;

const Overlay = styled(motion.div)`
  z-index:99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  z-index:99;
  position: fixed;
  width: 40vw;
  height: 60vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -70px;
`;

const BigCover = styled.div`
  background-position: center center;
  width: 100%;
  height: 300px;
  background-size: cover;
`;

const BigTitle = styled.h2`
  color: ${props => props.theme.white.lighter};
  font-size: 32px;
  padding: 15px;
`;

const GenreWrap = styled.p`
  padding: 15px;

  span {
    padding: 3px 10px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.white.lighter};
    font-size: 14px;
    margin-right: 8px;
  }
`;

const BigOverview = styled.p`
  color: ${props => props.theme.white.lighter};
  font-size: 16px;
  padding: 10px 15px;
  line-height: 140%;
`;

interface SelectedMovie {
  id: number;
  category: string;
}
function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  // 현재상영중인 영화리스트
  const { data: data, isLoading: isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovies,
  });
  // 영화 디테일 티스트
  const movieId = bigMovieMatch?.params.movieId;
  const {data: detailData,isLoading: detailIsLoading,} = useQuery<IDetailMovie>({
    queryKey: ["movieId", movieId],
    queryFn: () => getDetailMovie(movieId ?? ""),
    enabled: !!movieId
  });
  // 슬라이드 카운트
  const [selected, setSelected] = useState<SelectedMovie>();

  // 박스 밖 영역 클릭시 주소 바꾸기
  const onClickOverlay = () => {
    history.push("/");
  };

  const categories = ["now_playing", "popular", "upcoming", "top_rated"];
  return (
    <>
      <Wrapper>
        {isLoading ? <Loader>Loading...</Loader> :
          <>
            <Banner bgPhoto={makeImagePath(data?.results[1].backdrop_path || "")}>
              <Title>{data?.results[1].original_title}</Title>
              <Overview>{data?.results[1].overview}</Overview>
            </Banner>
            {categories.map((category) => (
              <SliderAll
                key={category}
                category={category}
                onBoxClick={(id, cat) => {
                  setSelected({ id, category: cat });
                  history.push(`/movies/${id}`);
                }}
              />
            ))}
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay onClick={onClickOverlay} exit={{ opacity: 0 }}
                           animate={{ opacity: 1 }} />
                  <BigMovie style={{ top: 200 }}
                            layoutId={`${selected?.category}-${bigMovieMatch.params.movieId}`}>
                    {detailData && (
                      <>
                        <BigCover
                          style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(detailData.backdrop_path, "w500")})` }} />
                        <BigInfo>
                          <BigTitle>{detailData.title}</BigTitle>
                          <GenreWrap>
                            {detailData.genres.map(genre => (
                              <span key={genre.id}>{genre.name}</span>
                            ))}
                          </GenreWrap>
                          <BigOverview>{detailData.overview}</BigOverview>
                        </BigInfo>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </>
        }
      </Wrapper>
      <Footer />
    </>
  );
}

export default Home;