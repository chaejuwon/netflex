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
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import SliderAll from "../components/tv/Slider";
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
const BgTitle = styled.h2`
  font-size:72px;
  color: ${props => props.theme.white.lighter};
  margin-bottom:30px;
`;
const BgOverView = styled.p`
  font-size:34px;
  color: ${props => props.theme.white.lighter};
  width: 60%;
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
const Slider = styled.div`
  position: relative;
  height: 200px;
  top:-100px;
`;
const SliderRow = styled(motion.div)`
  display:grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  height: 100%;
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
  z-index: 3;
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
const TvDetail = styled(motion.div)`
  z-index:99;
  position: fixed;
  width:40vw;
  height:60vh;
  top:100px;
  left:0;
  right:0;
  margin:0 auto;
`;
const Overlay = styled(motion.div)`
  z-index:99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .6);
`;
const DetailWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

`;
const DetailBg = styled.div<{bgPhoto: string}>`
  background: url(${props => props.bgPhoto});
  background-size:cover;
  height:300px;
`;
const DetailInfo = styled.div`
  background: ${props => props.theme.black.darker};
  padding:30px;
  max-height: 300px;
  overflow-y: auto;
`;
const DetailTitle = styled.h2`
  font-size: 48px;
  color: ${props => props.theme.white.lighter};
`;
const DetailOverview = styled.h2`
  font-size:20px;
  color: ${props => props.theme.white.lighter};
`;
const GenreWrap = styled.p`
  padding: 20px 0;

  span {
    padding: 3px 10px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.white.lighter};
    font-size: 14px;
    margin-right: 8px;
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
const rowVariants = {
  initial: {
    x: window.innerWidth
  },
  animate: {
    x: 0
  },
  exit: {
    x: -window.innerWidth
  }
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
  // airing_today TV API
  const {data: cateData, isLoading: cateIsLoading} = useQuery<IGetTvResult>({
    queryKey: ["tvs", "airing_today"],
    queryFn: () => getCategoryTvs("airing_today")
  })
  // 버튼클릭 시 슬라이드
  const offset = 6;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const onSlideFn = () => {
    setLeaving(prev => !prev);
  }
  const InCreaseFn = () => {
    if(leaving) return;
    onSlideFn();
    const total = (cateData?.results.length ?? 0) - 2;
    const maxLength = Math.floor(total / offset);
    setIndex(prev => prev === maxLength ? 0 : prev + 1);
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
    queryFn: () => getDetailTv(tvId as string),
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
            <BgWrap onClick={InCreaseFn} bgPhoto={makeImagePath(data?.results[1].backdrop_path as string)}>
              <BgTitle>{data?.results[1].name}</BgTitle>
              <BgOverView>{data?.results[1].overview}</BgOverView>
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
                >
                  {cateData && (
                    cateData.results.slice(offset * index, offset * index + offset).map(tv => (
                      <SliderCol
                        layoutId={"airing_today" + tv.id + ""}
                        key={tv.id}
                        bgPhoto={makeImagePath(tv.backdrop_path)}
                        variants={colVariants}
                        initial="normal"
                        whileHover="hover"
                        onClick={() => detailTv(tv.id, "airing_today")}
                      >
                        <SliderColTitle variants={titleVariants}>{tv.name}</SliderColTitle>
                      </SliderCol>
                    ))
                  )}
                </SliderRow>
              </AnimatePresence>
              <BtnWrap>
                <IncreaseBtn>▶</IncreaseBtn>
                <DecreaseBtn>◀</DecreaseBtn>
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
              {detailTvData && (
                <>
                  <Overlay
                    onClick={leaveDetail}
                    variants={overlayVariants}
                    initial="normal"
                    animate="hover"
                    exit="exit"
                  />
                  {/*<TvDetail layoutId={selectCate + detailTvData.id + ""}>*/}
                  {/*  <DetailWrap>*/}
                  {/*    <DetailBg bgPhoto={makeImagePath(detailTvData.backdrop_path)}/>*/}
                  {/*    <DetailInfo>*/}
                  {/*      <DetailTitle>{detailTvData.name}</DetailTitle>*/}
                  {/*      <GenreWrap>*/}
                  {/*        {detailTvData.genres.map(genre => (*/}
                  {/*          <span key={genre.id}>{genre.name}</span>*/}
                  {/*        ))}*/}
                  {/*      </GenreWrap>*/}
                  {/*      <DetailOverview>{detailTvData.overview}</DetailOverview>*/}
                  {/*    </DetailInfo>*/}
                  {/*  </DetailWrap>*/}
                  {/*</TvDetail>*/}
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