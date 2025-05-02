/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCounter,
  updateShelvesPosition,
} from "../../../slices/shelfDetailSlice";
import {
  setWoodShowCounter,
  updateWoodShelvesPosition,
} from "../../../slices/WoodShelfDetailSlice";
import {
  shelfCountsAccHeight,
  woodShelfCountsAccHeight,
} from "../../../assets/data/ConfigratorData";
import "./ShelfCounter.css";

const SliderShelfCounter = ({ onClick, showCounter }) => {
  const counterRef = useRef(null);
  const dispatch = useDispatch();
  let positionArray = [];
  const metalRacks = useSelector((state) => state.shelfDetail.racks);
  const woodRacks = useSelector((state) => state.woodShelfDetail.racks);

  const material = useSelector(
    (state) => state.shelfDetail.racks.execution.material
  );

  const sectionData =
    material === "metal" ? metalRacks?.sections : woodRacks?.sections;

  const sectionId =
    material === "metal"
      ? metalRacks?.selectedSection
      : woodRacks?.selectedSection;

  const currentSection = sectionData[sectionId];

  const shelfHeight = currentSection?.height || 200;

  
  const getShelfCount = (shelves) => {
    return (
      Object.keys(shelves || {}).filter((key) => key.startsWith("shelves_"))
      .length || 3
    );
  };
  
  // const initialShelfCount = currentSection
  //   ? Object.keys(currentSection.shelves).length
  //   : 3;

  const initialShelfCount = getShelfCount(currentSection.shelves);

  const maxShelfCount =
    material === "metal"
      ? shelfCountsAccHeight[shelfHeight]?.max || 11
      : woodShelfCountsAccHeight[shelfHeight]?.max || 11;

  const [shelfCount, setShelfCount] = useState(initialShelfCount);

  useEffect(() => {
    if (currentSection) {
      const newCount = getShelfCount(currentSection.shelves);
      if (newCount !== shelfCount && newCount >= 3) {
        setShelfCount(newCount);
      }
    }
  }, [sectionId]);

  const updatePositions = (count) => {
    const positions = GeneratePosArr(shelfHeight, count);
    if (material === "metal") {
      dispatch(updateShelvesPosition({ sectionId, positionArray: positions }));
    } else {
      dispatch(
        updateWoodShelvesPosition({ sectionId, positionArray: positions })
      );
    }
  };

  // useEffect(() => {
  //   if (currentSection) {

  //     // const newShelfCount = Object.keys(currentSection.shelves)
  //     // .filter(key => key.startsWith('shelves_'))
  //     // .length;


  //     const newShelfCount = Object.keys(currentSection.shelves).length;
  //     if (newShelfCount !== shelfCount) {
  //       setShelfCount(newShelfCount);
  //     }
  //   }
  // }, [currentSection, sectionId]);

  const calculateSliderStyle = (value, max, min = 3) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return { "--value-percent": `${percentage}%` };
  };

  const heightArr = [
    { 90: "52" },
    { 100: "57" },
    { 120: "67" },
    { 150: "82" },
    { 180: "97" },
    { 200: "107" },
    { 210: "112" },
    { 220: "117" },
    { 240: "127" },
    { 250: "132" },
    { 300: "157" },
    { 350: "182" },
  ];

  // Generate shelf positions according to shelf count
  const GeneratePosArr = (currShelfHeight, shelfCount) => {
    const Result = heightArr.find((obj) => obj[currShelfHeight] !== undefined);
    const heightResult = parseInt(Object.values(Result)[0]);

    const positions = [];

    for (let i = 0; i < shelfCount; i++) {
      const topPosition = ((heightResult - 9.5) / (shelfCount - 1)) * i;
      positions.push({
        zIndex: shelfCount - i,
        top: `${topPosition}em`,
      });
    }
    return positions;
  };

  // useEffect(() => {
  //   positionArray = GeneratePosArr(shelfHeight, shelfCount);
  //   if (material === "metal") {
  //     dispatch(updateShelvesPosition({ sectionId, positionArray }));
  //   } else {
  //     dispatch(updateWoodShelvesPosition({ sectionId, positionArray }));
  //   }
  // }, [shelfCount]);


  // Handle slider change
  const handleShelfChange = (e) => {
    const newCount = parseInt(e.target.value);
    setShelfCount(newCount);
    updatePositions(newCount);
    // const positionArray = GeneratePosArr(shelfHeight, newCount);
    // dispatch(updateShelvesPosition({ sectionId, positionArray }));
  };

  // const handleShelfChange = (e) => {
  //   const newCount = parseInt(e.target.value);
  //   const positionArray = GeneratePosArr(shelfHeight, newCount);

  //   if (material === "metal") {
  //     dispatch(updateShelvesPosition({ sectionId, positionArray }));
  //   } else {
  //     dispatch(updateWoodShelvesPosition({ sectionId, positionArray }));
  //   }
  // };

  return (
    <div ref={counterRef} className="dimension-row">
      <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal text-black font-normal leading-none justify-center flex items-center gap-3">
        Borden
        <span className="font-inter text-xs tracking-normal text-black font-semibold leading-none">
          {shelfCount}
        </span>
      </label>
      <div className="dimension-control">
        <div className="slider-container">
          <input
            type="range"
            min="3"
            max={maxShelfCount}
            value={shelfCount}
            onChange={handleShelfChange}
            className="dimension-slider"
            style={calculateSliderStyle(shelfCount, maxShelfCount)}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderShelfCounter;
