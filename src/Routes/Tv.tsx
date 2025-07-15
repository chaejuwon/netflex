import { useQuery } from "@tanstack/react-query";
import {
  getCategoryTvs,
  getDetailTv,
  getTvs,
  IDetailTv,
  IGetTvResult,
} from "../api";
import { styled } from "styled-components";
import Footer from "../components/common/Footer";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SliderAll from "../components/tv/Slider";
import images from "../images/no_image.jpg";
import { device } from "../media";
// 공토요소
const Mt40 = styled.div`
  margin-top: 40px;
`;
const Mt30 = styled.div`
  margin-top: 30px;
`;
const Wrapper = styled.div`
  width: 100%;
`;
const BgWrap = styled.div<{bgPhoto: string}>`
  background:linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(${props => props.bgPhoto}) no-repeat center center;
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding:60px;
`;
// const BgTitle = styled.h2`
//   font-size:72px;
//   color: ${props => props.theme.white.lighter};
//   margin-bottom:30px;
// `;
// const BgOverView = styled.p`
//   font-size:34px;
//   color: ${props => props.theme.white.lighter};
//   width: 60%;
// `;
const Slider = styled.div`
  position: relative;
  height: 200px;
  top:-100px;
`;
const SliderRow = styled(motion.div)`
  display:grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  @media ${device.mobile} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SliderCol = styled(motion.div)<{bgPhoto: string}>`
  background: url(${props=> props.bgPhoto}) no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: end;
  height: 100%;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const SliderColTitle = styled(motion.div)`
  width: 100%;
  font-size:20px;
  text-align: center;
  padding: 15px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  opacity: 0;
`;
const BtnWrap = styled.div`
  position: relative;
  z-index: 99;
`;
const IncreaseBtn =styled.div`
  position: absolute;
  right:10px;
  top:75px;
  font-size: 18px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  border-radius: 50%;
  text-align: center;
  padding:15px;
  cursor: pointer;
`;
const DecreaseBtn = styled.div`
  position: absolute;
  left:10px;
  top:75px;
  font-size: 18px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  border-radius: 50%;
  text-align: center;
  padding:15px;
  cursor: pointer;
`;
const Title = styled.h2`
  font-size: 72px;
  font-weight: bold;
  @media ${device.mobile} {
    font-size: 48px;
  }
`;

const Overview = styled.p`
  font-size: 24px;
  line-height: 140%;
  width: 60%;
  margin:20px 0;
  @media ${device.mobile} {
    width:80%;
    height: 110px;
    font-size: 20px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Button = styled(motion.button)`
  padding:10px 12px;
  font-size:20px;
  width: 200px;
  color: ${props => props.theme.white.lighter};
  border: 2px solid ${props => props.theme.white.lighter};
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
  @media ${device.mobile} {
    width: 80vw;
  }
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
  @media ${device.mobile} {
    height: 300px;
  }
`;

const BigTitle = styled.h2`
  color: ${props => props.theme.white.lighter};
  font-size: 40px;
  font-weight: bold;
  @media ${device.mobile} {
    font-size: 32px;
  }
`;
const GenreWrap = styled.p`
  padding: 10px;
  span {
    padding: 2px 8px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.white.lighter};
    font-size: 14px;
    margin: 5px;
    display: inline-block;
  }
  @media ${device.mobile} {
    padding: 0;
    span {
      font-size: 12px;
    }
  }
`;

const BigOverview = styled.p`
  color: ${props => props.theme.white.lighter};
  font-size: 16px;
  line-height: 140%;
  @media ${device.mobile} {
    font-size: 14px;
  }
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
  @media ${device.mobile} {
    font-size:24px;
  }
`;
const InfoTitle = styled.h3`
  font-size:22px;
  font-weight: bold;
  padding: 0;
  color: ${props => props.theme.white.lighter};
  @media ${device.mobile} {
    font-size:18px;
  }
`;
const InfoContent = styled.p`
  font-size: 18px;
  margin-left:15px;
  color: ${props => props.theme.white.lighter};
  @media ${device.mobile} {
    font-size: 16px;
  }
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
  @media ${device.mobile} {
    p {
      font-size:18px;
    }
    span {
      font-size:16px;
    }
  }
`;
const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap:10px;
  @media ${device.mobile} {
    grid-template-columns: repeat(1, 1fr);
    gap:15px;
  }
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
    min-width: 100px;
    border-radius: 50%;
    aspect-ratio: 1/1;
  }
  p {
    margin-top:5px;
  }
  @media ${device.mobile} {
    max-width: 100px;
    height:125px;
    p {
      font-size: 12px;
    }
  }
`;
const EpisodeWrap = styled.div`
  display: flex;
  justify-content: start;
  gap: 20px;
  margin-top:20px;
  div {
    aspect-ratio: 8 / 5;
    width: 100%;
    max-width: 350px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 7px;
  }
  p {
    font-size: 16px;
    line-height: 140%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media ${device.mobile} {
    h2 {
      font-size: 16px;
    }
    p {
      font-size: 12px;
      -webkit-line-clamp: 3;
    }
  }
`;
const rowVariants = {
  initial: (state: boolean) => ({
    x: state ? window.innerWidth : -window.innerWidth
  }),
  animate: {
    x: 0
  },
  exit: (state: boolean) => ({
    x: state ? -window.innerWidth : window.innerWidth
  })
}
const colVariants = {
  normal: {
    scale: 1,
    zIndex: 1
  },
  hover: {
    zIndex: 99,
    scale: 1.2,
    transition: {
      duration: 0.3,
      delay: 0.5
    }
  }
}
const titleVariants = {
  normal: {
    opacity: 0
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.5
    }
  }
}
const overlayVariants = {
  normal: {
    opacity: 0
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
}
function Tv() {
  // 한국 TV API
  const {data:data, isLoading:isLoading} = useQuery<IGetTvResult>({
    queryKey: ["tv", "change"],
    queryFn: getTvs
  })
  console.log(data);
  // airing_today TV API
  const {data: cateData, isLoading: cateIsLoading} = useQuery<IGetTvResult>({
    queryKey: ["tvs", "airing_today"],
    queryFn: () => getCategoryTvs("airing_today")
  })
  // const offset = 6;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [state, setState] = useState(false);
  const [offset, setOffset] = useState(6);

  // 화면 크기에 따라 offset 조정
  useEffect(() => {
    const updateOffset = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setOffset(2);
      } else {
        setOffset(6);
      }
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);

    return () => window.removeEventListener("resize", updateOffset);
  }, []);
  const onSlideFn = () => {
    setLeaving(prev => !prev);
  }
  const InCreaseFn = () => {
    if(leaving) return;
    onSlideFn();
    setState(true);
    const total = (cateData?.results.length ?? 0);
    const maxLength = Math.floor(total / offset) - 1;
    setIndex(prev => prev === maxLength ? 0 : prev + 1);
  }
  const DeCreaseFn = () => {
    if(leaving) return;
    onSlideFn();
    setState(false);
    const total = (cateData?.results.length ?? 0);
    const maxLength = Math.floor(total / offset) - 1;
    setIndex(prev => prev === 0 ? maxLength : prev - 1);
  }
  // 해당 주소 불러오기 id값으로
  const history = useHistory();
  const bigMatch = useRouteMatch<{tvId: string}>("/tv/:tvId");
  const [selectCate, setSelectCate] = useState("");
  const detailTv = (id: number, category: string) => {
    setSelectCate(category)
    document.body.style.overflowY = "hidden";
    history.push(`/tv/${id}`);
  }
  // Tv detail api
  const tvId = bigMatch?.params.tvId;
  const {data: detailTvData, isLoading: detailTvLoading} = useQuery<IDetailTv>({
    queryKey: ["tv", tvId],
    queryFn: () => getDetailTv(tvId ?? ""),
    enabled: !!tvId
  })
  console.log(detailTvData);
  const leaveDetail = () => {
    document.body.style.overflowY = "auto";
    history.push('/tv');
  }
  const categories = ["on_the_air", "popular", "top_rated"];
  return (
    <>
      <Wrapper>
        {isLoading ? "...loading" : (
          <>
            <BgWrap bgPhoto={makeImagePath(data?.results[0].backdrop_path as string)}>
              <Title>{data?.results[0].name}</Title>
              <Overview>{data?.results[0].overview}</Overview>
              <Button onClick={() => detailTv(data?.results[0].id as number, "normal")}>상세보기</Button>
            </BgWrap>
            <Slider>
              <AnimatePresence initial={false} onExitComplete={onSlideFn}>
                <SliderRow
                  key={index}
                  variants={rowVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "tween", duration: 0.5 }}
                  custom={state}
                >
                  {cateData && (
                    cateData.results.slice(offset * index, offset * index + offset).map(tv => (
                      <SliderCol
                        layoutId={"airing_today-" + tv.id + ""}
                        key={tv.id}
                        bgPhoto={makeImagePath(tv.backdrop_path)}
                        variants={colVariants}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => detailTv(tv.id, "airing_today")}
                      >
                        <SliderColTitle variants={titleVariants}>{tv.original_name}</SliderColTitle>
                      </SliderCol>
                    ))
                  )}
                </SliderRow>
              </AnimatePresence>
              <BtnWrap>
                <IncreaseBtn onClick={InCreaseFn}>▶</IncreaseBtn>
                <DecreaseBtn onClick={DeCreaseFn}>◀</DecreaseBtn>
              </BtnWrap>
            </Slider>
            {categories.map((category) => (
              <SliderAll
                key={category}
                category={category}
                onDetail={(id, category) => {
                  detailTv(id, category)
                }}
              />
            ))}
            <AnimatePresence>
              {bigMatch && (
                <>
                  <Overlay
                    onClick={leaveDetail}
                    variants={overlayVariants}
                    initial="normal"
                    animate="hover"
                    exit="exit"
                  />
                  <BigMovie style={{ top: 100 }}
                            layoutId={selectCate ? `${selectCate}-${bigMatch.params.tvId}` : `now-${bigMatch.params.tvId}`}>
                    {detailTvData && (
                      <>
                        <BigCover
                          style={{ backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(detailTvData.backdrop_path, "w500")})` }} />
                        <BigInfo>
                          <BigTitle>{detailTvData.name}</BigTitle>
                          <Mt30>
                            <Tagline>
                              {detailTvData.tagline}
                            </Tagline>
                          </Mt30>
                          <Mt30>
                            <GridWrap>
                              <FlexWrap>
                                <InfoTitle>장르</InfoTitle>
                                <GenreWrap>
                                  {detailTvData.genres.slice(0, 2).map(genre => (
                                    <span key={genre.id}>{genre.name}</span>
                                  ))}
                                </GenreWrap>
                              </FlexWrap>
                              <FlexWrap>
                                <InfoTitle>첫방영일</InfoTitle>
                                <InfoContent>{detailTvData.first_air_date}</InfoContent>
                              </FlexWrap>
                              <FlexWrap>
                                <InfoTitle>평점참여자</InfoTitle>
                                <InfoContent>{detailTvData.vote_count.toLocaleString()}명</InfoContent>
                              </FlexWrap>
                              <FlexWrap>
                                <InfoTitle>평점</InfoTitle>
                                <InfoContent>{detailTvData.vote_average} / 10</InfoContent>
                              </FlexWrap>
                            </GridWrap>
                          </Mt30>
                          <Mt30>
                            <BigOverview>{detailTvData.overview}</BigOverview>
                          </Mt30>
                          <Mt40>
                            <InfoFlexTitle>
                              <p>최근회차 - Episode{detailTvData.last_episode_to_air?.episode_number} ({detailTvData.last_episode_to_air?.air_date})</p>
                            </InfoFlexTitle>
                            <EpisodeWrap>
                              <div>
                                <img src={detailTvData.last_episode_to_air?.still_path ? makeImagePath(detailTvData.last_episode_to_air?.still_path) : images} />
                              </div>
                              <div>
                                <h2>{detailTvData.last_episode_to_air?.name}</h2>
                                <p>{detailTvData.last_episode_to_air?.overview}</p>
                              </div>
                            </EpisodeWrap>
                          </Mt40>
                          <Mt40>
                            <InfoFlexTitle>
                              <p>출연진</p>
                              <span>{detailTvData.credits.cast.length}명</span>
                            </InfoFlexTitle>
                            <CreditWrap>
                              {detailTvData.credits.cast.map((cast) => (
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
                              <span>{detailTvData.credits.crew.length}명</span>
                            </InfoFlexTitle>
                            <CreditWrap>
                              {detailTvData.credits.crew.map((crew) => (
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
              )}
            </AnimatePresence>
          </>
        )}
      </Wrapper>
      <Footer />
    </>
  )
}
export default Tv;