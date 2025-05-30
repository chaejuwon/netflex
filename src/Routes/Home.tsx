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
import images from "../images/no_image.jpg";
// 공토요소
const Mt40 = styled.div`
  margin-top: 40px;
`;
const Mt30 = styled.div`
  margin-top: 30px;
`;
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
`;

const Overview = styled.p`
  font-size: 24px;
  line-height: 140%;
  width: 60%;
  margin:20px 0;
`;

const Button = styled(motion.button)`
  padding:10px 12px;
  font-size:20px;
  width: 200px;
  color: ${props => props.theme.white.lighter};
  border: 2px solid ${props => props.theme.black.darker};
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  font-weight: bold;
  transition: all .3s ease-in-out;
  &:hover {
    color: ${props => props.theme.black.darker};
    border: 2px solid ${props => props.theme.white.lighter};
    background: ${props => props.theme.white.lighter};
  }
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
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow-x: auto;
`;
const BigInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: -75px;
  padding: 15px;
`;

const BigCover = styled.div`
  background-position: center center;
  width: 100%;
  height: 350px;
  background-size: cover;
`;

const BigTitle = styled.h2`
  color: ${props => props.theme.white.lighter};
  font-size: 40px;
  font-weight: bold;
`;
const GenreWrap = styled.p`
  padding: 10px;

  span {
    padding: 2px 8px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.white.lighter};
    font-size: 14px;
    margin-right: 8px;
  }
`;

const BigOverview = styled.p`
  color: ${props => props.theme.white.lighter};
  font-size: 16px;
  line-height: 140%;
`;
const Tagline = styled.h2`
  font-size:28px;
  color: ${props=> props.theme.white.lighter};
  padding: 0 15px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top:0;
    left:0;
    width:2px;
    height: 100%;
    background-color: red;
  }
`;
const InfoTitle = styled.h3`
  font-size:22px;
  font-weight: bold;
  padding: 0;
  color: ${props => props.theme.white.lighter};
`;
const InfoContent = styled.p`
  font-size: 18px;
  margin-left:15px;
  color: ${props => props.theme.white.lighter};
`;
const InfoFlexTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  font-weight: bold;
  color: ${props => props.theme.white.lighter};
  p {
    font-size:22px;
  }
  span {
    font-size:20px;
  }
`;
const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap:10px;
`;
const FlexWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const CreditWrap = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap:10px;
  margin-top:30px;
`;
const CreditItem = styled.div`
  flex: 0 0 20%;
  text-align: center;
  img {
    width: 100%;
    max-width: 145px;
    border-radius: 50%;
    aspect-ratio: 1/1;
  }
  p {
    margin-top:5px;
  }
`;
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
  const [selected, setSelected] = useState("");
  const onBoxClick= (id:number, category:string) => {
    setSelected(category);
    history.push(`/movies/${id}`);
    document.body.style.overflowY = "hidden";
  }

  // 박스 밖 영역 클릭시 주소 바꾸기
  const onClickOverlay = () => {
    history.push("/");
    document.body.style.overflowY = "auto";
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
              <Button
                layoutId={`${data?.results[1].id}`}
                onClick={() => onBoxClick(data?.results[1].id as number, "now")}
              >
                상세보기
              </Button>
            </Banner>
            {categories.map((category) => (
              <SliderAll
                key={category}
                category={category}
                onBoxClick={(id, category) => {
                  onBoxClick(id, category);
                }}
              />
            ))}
            <AnimatePresence>
              {bigMovieMatch ? (
                <>
                  <Overlay onClick={onClickOverlay} exit={{ opacity: 0 }}
                           animate={{ opacity: 1 }} />
                  <BigMovie style={{ top: 100 }}
                            layoutId={selected ? `${selected}-${bigMovieMatch.params.movieId}` : `now-${bigMovieMatch.params.movieId}`}>
                    {detailData && (
                      <>
                        <BigCover
                          style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(detailData.backdrop_path, "w500")})` }} />
                        <BigInfo>
                          <BigTitle>{detailData.title}</BigTitle>
                          <Mt30>
                            <Tagline>
                              {detailData.tagline}
                            </Tagline>
                          </Mt30>
                          <Mt30>
                              <GridWrap>
                                <FlexWrap>
                                  <InfoTitle>장르</InfoTitle>
                                  <GenreWrap>
                                    {detailData.genres.map(genre => (
                                      <span key={genre.id}>{genre.name}</span>
                                    ))}
                                  </GenreWrap>
                                </FlexWrap>
                                <FlexWrap>
                                  <InfoTitle>출시날짜 / 상영시간</InfoTitle>
                                  <InfoContent>{detailData.release_date} / {detailData.runtime}분</InfoContent>
                                </FlexWrap>
                                <FlexWrap>
                                  <InfoTitle>평점참여자</InfoTitle>
                                  <InfoContent>{detailData.vote_count.toLocaleString()}명</InfoContent>
                                </FlexWrap>
                                <FlexWrap>
                                  <InfoTitle>평점</InfoTitle>
                                  <InfoContent>{detailData.vote_average} / 10</InfoContent>
                                </FlexWrap>
                              </GridWrap>
                          </Mt30>
                          <Mt30>
                            <BigOverview>{detailData.overview}</BigOverview>
                          </Mt30>
                          <Mt40>
                            <InfoFlexTitle>
                              <p>출연진</p>
                              <span>{detailData.credits.cast.length}명</span>
                            </InfoFlexTitle>
                            <CreditWrap>
                              {detailData.credits.cast.map((cast) => (
                                <CreditItem key={cast.credit_id}>
                                  {cast.profile_path ?  <img src={makeImagePath(cast.profile_path, "w200")} /> : <img src={images} />}
                                  <p>{cast.name ? cast.name : cast.original_name}</p>
                                </CreditItem>
                                ))}
                            </CreditWrap>
                          </Mt40>
                          <Mt40>
                            <InfoFlexTitle>
                              <p>제작진</p>
                              <span>{detailData.credits.crew.length}명</span>
                            </InfoFlexTitle>
                            <CreditWrap>
                              {detailData.credits.crew.map((crew) => (
                                <CreditItem key={crew.credit_id}>
                                  {crew.profile_path ?  <img src={makeImagePath(crew.profile_path, "w200")} /> : <img src={images} />}
                                  <p>{crew.name ? crew.name : crew.original_name}</p>
                                </CreditItem>
                              ))}
                            </CreditWrap>
                          </Mt40>
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