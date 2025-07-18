import { useQuery } from "@tanstack/react-query";
import {
  getCategoryTvs,
  getDetailTv,
  IDetailTv,
  IGetTvResult,
} from "../../api";
import { styled } from "styled-components";
import { makeImagePath } from "../../utils";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import images from "../../images/no_image.jpg";
import { device } from "../../media";


const Slider = styled.div`
  position:relative;
  width:100%;
  max-width: 1680px;
  margin:50px auto 50px;
  overflow: hidden;
  padding-bottom:200px;
`;
const SliderRow = styled(motion.div)`
  z-index:2;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap:5px;
  position: absolute;
  width: 100%;

  @media ${device.mobile} {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const SliderTitle = styled.h2`
  font-size:32px;
  color: ${props=> props.theme.white.lighter};
  margin-bottom:20px;

  @media ${device.mobile} {
    font-size: 24px;
  }
`;
const SliderCol = styled(motion.div)<{bgPhoto: string}>`
  display: flex;
  align-items: end;
  height: 200px;
  background: url(${props => props.bgPhoto}) no-repeat center center;
  background-size: cover;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const ColTitle = styled(motion.h2)`
  width: 100%;
  font-size:16px;
  color: ${props => props.theme.white.lighter};
  background-color: ${props => props.theme.black.darker};
  padding:15px;
  text-align: center;
`;
const BtnWrap = styled.div`
  position: relative;
  z-index: 3;
`;
const IncreaseBtn =styled.div`
  position: absolute;
  right:10px;
  top:75px;
  font-size: 14px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  border-radius: 50%;
  text-align: center;
  padding:10px;
  cursor: pointer;
`;
const DecreaseBtn = styled.div`
  position: absolute;
  left:10px;
  top:75px;
  font-size: 14px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  border-radius: 50%;
  text-align: center;
  padding:10px;
  cursor: pointer;
`;
const rowVariants = {
  initial: (state: boolean) => ({
    x: state ? -window.innerWidth : window.innerWidth
  }),
  animate: {
    x: 0
  },
  exit: (state: boolean) => ({
    x: state ? window.innerWidth : -window.innerWidth
  })
}
const colVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -20,
    transition: {
      duration: 0.3,
      delay: 0.3
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
interface SliderCategoryProps {
  category: string;
  onDetail: (id: number, category: string) => void;
}
function SliderAll({ category, onDetail }:SliderCategoryProps) {
  const {data: cateData, isLoading: cateIsLoading} = useQuery<IGetTvResult>({
    queryKey: ["tvs", category],
    queryFn: () => getCategoryTvs(category)
  })
  // 슬라이드 함수
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

  const increaseFn = () => {
    if (leaving) return;
    leavingFn();
    setState(false);
    const total = cateData?.results.length ?? 0;
    const maxLength = Math.floor(total / offset) - 1;
    setIndex(prev => prev === maxLength ? 0 : prev + 1);
  }
  const decreaseFn = () => {
    if (leaving) return;
    leavingFn();
    setState(true);
    const total = cateData?.results.length ?? 0;
    const maxLength = Math.floor(total / offset) - 1;
    setIndex(prev => prev === 0 ? maxLength : prev - 1);
  };
  const leavingFn = () => {
    setLeaving(prev => !prev);
  }
  const detailTv = (id: number, category:string) => {
    onDetail(id, category);
  }
  return (
    <>
      <Slider>
        <SliderTitle>
          {category == "on_the_air" ? "방송중" : (category == "popular" ? "유명순" : "인기순")}
        </SliderTitle>
        <AnimatePresence initial={false} onExitComplete={leavingFn}>
          <SliderRow
            key={index}
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            custom={state}
          >
            {cateData && (
              cateData.results.slice(offset * index, (offset * index) + offset).map(tv => (
                <>
                  <SliderCol
                    key={tv.id}
                    bgPhoto={tv.backdrop_path ? makeImagePath(tv.backdrop_path, "w500") : images }
                    variants={colVariants}
                    initial="normal"
                    whileHover="hover"
                    layoutId={category + "-" + tv.id}
                    onClick={() => detailTv(tv.id, category)}
                  >
                    <ColTitle variants={titleVariants}>{tv.name}</ColTitle>
                  </SliderCol>
                </>
              ))
            )}
          </SliderRow>
        </AnimatePresence>
        <BtnWrap>
          <IncreaseBtn onClick={increaseFn}>▶</IncreaseBtn>
          <DecreaseBtn onClick={decreaseFn}>◀</DecreaseBtn>
        </BtnWrap>
      </Slider>
    </>
  )
}
export default SliderAll;