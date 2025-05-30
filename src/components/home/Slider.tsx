import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../../utils";
import { styled } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getCategoryMovies, IGetMovieResult } from "../../api";
import { useState } from "react";

const PopularSlider = styled(motion.div)`
  position: relative;
  top: -150px;
  width: 100%;
  max-width: 1680px;
  margin: 30px auto;
  padding-bottom: 170px;
  overflow: hidden;
`;

const PopularTitle = styled.h2`
  font-size: 32px;
  color: ${props => props.theme.white.lighter};
`;

const PopularRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin-top:20px;
  gap:5px;
  position: absolute;
  width: 100%;
`;

const PopularCol = styled(motion.div)<{bgPhoto: string}>`
  width: 100%;
  background: url(${props => props.bgPhoto});
  background-size: cover;
  height: 150px;
  cursor: pointer;
  position: relative;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const PopularColTitle = styled(motion.h2)`
  font-size:16px;
  color: ${props => props.theme.white.lighter};
  text-align: center;
  position: absolute;
  bottom:0;
  padding:15px;
  background-color: ${props => props.theme.black.darker};
  width:100%;
  opacity: 0;
`;

const PopularBtnWrap = styled.div`
  position: relative;
`;

const PopularBtnIncrease = styled.div`
  z-index: 99;
  position: absolute;
  top:75px;
  right:10px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  padding:10px;
  border-radius: 50%;
  cursor: pointer;
`;

const PopularBtnDecrease = styled.div`
  z-index: 99;
  position: absolute;
  top:75px;
  left:10px;
  background-color: ${props => props.theme.black.darker};
  color: ${props => props.theme.white.lighter};
  padding:10px;
  border-radius: 50%;
  cursor: pointer;
`;

const PopularVariants = {
  normal : {
    zIndex:1,
    scale: 1
  },
  hover : {
    zIndex: 10,
    y: -20,
    scale: 1.3,
    transition: {
      duration: 0.3,
      delay: 0.5
    }
  }
}

const PopularTitleVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
    },
  },
}

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

interface ICategory {
  category: string;
}
interface SliderAllProps {
  category: string;
  onBoxClick: (id: number, category: string) => void;
}


function SliderAll({category, onBoxClick}:SliderAllProps) {
  // 슬라이드 카운트
  const { data, isLoading } = useQuery<IGetMovieResult>({
    queryKey: ["movies", category],
    queryFn: () => getCategoryMovies(category),
  });

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const offset = 6;

  const toggleLeaving = () => setLeaving(prev => !prev);

  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const total = (data?.results.length ?? 0) - 1;
    const max = Math.floor(total / offset) - 1;
    setIndex(prev => (prev === max ? 0 : prev + 1));
  };

  const decreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const total = (data?.results.length ?? 0) - 1;
    const max = Math.floor(total / offset) - 1;
    setIndex(prev => (prev === 0 ? max : prev - 1));
  };

  const detailMovie = (id: number, category:string) => {
    onBoxClick(id, category)
  }
  return (
    <PopularSlider>
      <PopularTitle>
        {category === "popular"
          ? "유명 영화"
          : category === "upcoming"
            ? "개봉예정 영화"
            : category === "top_rated"
              ? "인기영화"
              : ""}
      </PopularTitle>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <PopularRow
          key={index}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
        >
          {isLoading ? (
            "...Loading"
          ) : (
            data?.results
              .slice(offset * index, offset * index + offset)
              .map(movie => (
                <PopularCol
                  layoutId={`${category}-${movie.id}`}
                  key={movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  variants={PopularVariants}
                  initial="normal"
                  whileHover="hover"
                  onClick={() => detailMovie(movie.id, category)}
                >
                  <PopularColTitle variants={PopularTitleVariants}>
                    {movie.title}
                  </PopularColTitle>
                </PopularCol>
              ))
          )}
        </PopularRow>
      </AnimatePresence>
      <PopularBtnWrap>
        <PopularBtnIncrease onClick={increaseIndex}>▶</PopularBtnIncrease>
        <PopularBtnDecrease onClick={decreaseIndex}>◀</PopularBtnDecrease>
      </PopularBtnWrap>
    </PopularSlider>
  );
}
export default SliderAll;