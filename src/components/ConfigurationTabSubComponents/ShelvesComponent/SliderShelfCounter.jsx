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

  const material = useSelector(
    (state) => state.shelfDetail.racks.execution.material
  );

  const sectionData =
    material === "metal"
      ? useSelector((state) => state.shelfDetail.racks.sections)
      : useSelector((state) => state.woodShelfDetail.racks.sections);

  const sectionId =
    material === "metal"
      ? useSelector((state) => state.shelfDetail.racks.selectedSection)
      : useSelector((state) => state.woodShelfDetail.racks.selectedSection);

  const currentSection = sectionData[sectionId];

  const shelfHeight = currentSection?.height || 200;
  const shelfKeys = Object.keys(currentSection.shelves);
  const currentSection_shelves = shelfKeys.filter((key) =>
    key.includes("shelve")
  );
  const initialShelfCount = currentSection ? currentSection_shelves.length : 3;

  const maxShelfCount =
    material === "metal"
      ? shelfCountsAccHeight[shelfHeight]?.max || 11
      : woodShelfCountsAccHeight[shelfHeight]?.max || 11;

  const [shelfCount, setShelfCount] = useState(initialShelfCount);

  useEffect(() => {
    if (currentSection) {
      const newShelfCount = Object.keys(currentSection.shelves).length;
      setShelfCount(newShelfCount);
    }
  }, [currentSection, sectionId, currentSection?.shelves]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        counterRef.current &&
        !event.target.closest(".CounterWithAddRemove_container")
      ) {
        if (material === "metal") {
          dispatch(setShowCounter(false));
        } else {
          dispatch(setWoodShowCounter(false));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle slider change
  const handleShelfChange = (e) => {
    const newCount = parseInt(e.target.value);

    positionArray = GeneratePosArr(shelfHeight, newCount);
    if (material === "metal") {
      dispatch(updateShelvesPosition({ sectionId, positionArray }));
    } else {
      dispatch(updateWoodShelvesPosition({ sectionId, positionArray }));
    }
    setShelfCount(newCount);
  };

  return (
    <div ref={counterRef} className="dimension-row">
      <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal text-black font-normal leading-none justify-center flex items-center gap-3">
        Borden
        <span className="font-inter text-xs tracking-normal text-black font-semibold leading-none">
          {initialShelfCount}
        </span>
      </label>
      <div className="dimension-control">
        <div className="slider-container">
          <input
            type="range"
            min="3"
            max={maxShelfCount}
            value={initialShelfCount}
            onChange={handleShelfChange}
            className="dimension-slider"
            style={calculateSliderStyle(initialShelfCount, maxShelfCount)}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderShelfCounter;
