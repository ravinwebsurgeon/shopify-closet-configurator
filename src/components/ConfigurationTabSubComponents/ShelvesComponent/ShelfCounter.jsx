import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ShelfCounter.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowCounter,
  updateShelvesPosition,
} from "../../../slices/shelfDetailSlice";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";

const ShelfCounter = ({ onClick }) => {
  const counterRef = useRef(null);
  const dispatch = useDispatch();
  let positionArray = [];

  const sectionData = useSelector((state) => state.shelfDetail.racks.sections);
  const sectionId = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const currentSection = sectionData[sectionId];
  const shelf_count = currentSection
    ? Object.keys(currentSection.shelves).length
    : 3;
  const shelfHeight = currentSection["height"];
  const [shelfCount, setShelfCount] = useState(shelf_count);

  const heightArr = [
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
  ];

  // function used to set shelves at a specific height
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

  useEffect(() => {
    positionArray = GeneratePosArr(shelfHeight, shelfCount);
    dispatch(updateShelvesPosition({ sectionId, positionArray }));
  }, [shelfCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        counterRef.current &&
        !event.target.closest(".CounterWithAddRemove_container")
      ) {
        dispatch(setShowCounter(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddShelf = (e) => {
    e.preventDefault();
    const maxShelfCount = shelfCountsAccHeight[shelfHeight]["max"];    
    if (shelfCount >= maxShelfCount) {
      setShelfCount(maxShelfCount);
      return;
    } else {
      setShelfCount((prevData) => prevData + 1);
    }
  };

  const handleRemoveShelf = (e) => {
    e.preventDefault();
    setShelfCount((prevData) => prevData - 1);
    console.log("position arrray", GeneratePosArr(shelfHeight, shelfCount));
  };

  return (
    <>
      <div
        ref={counterRef}
        class="CounterWithAddRemove_container justify-center"
      >
        <div class="CounterWithAddRemove_counter">
          <button
            className="shelf-decreament-btn py-2 pl-3 pr-6"
            disabled={shelfCount === 3}
            onClick={handleRemoveShelf}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.25 5.25C8.66421 5.25 9 5.58579 9 6C9 6.41421 8.66421 6.75 8.25 6.75H3.75C3.33579 6.75 3 6.41421 3 6C3 5.58579 3.33579 5.25 3.75 5.25H8.25Z"
                fill="white"
              ></path>
            </svg>{" "}
          </button>
          <span className="shelf-counter !text-sm font-roboto">
            {shelfCount}
          </span>
          <button
            className="shelf-increament-btn py-2 pr-3 pl-6"
            onClick={handleAddShelf}
          >
            {" "}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 10.5C6.31066 10.5 6.5625 10.2482 6.5625 9.9375V6.5625H9.9375C10.2482 6.5625 10.5 6.31066 10.5 6C10.5 5.68934 10.2482 5.4375 9.9375 5.4375H6.5625V2.0625C6.5625 1.75184 6.31066 1.5 6 1.5C5.68934 1.5 5.4375 1.75184 5.4375 2.0625V5.4375H2.0625C1.75184 5.4375 1.5 5.68934 1.5 6C1.5 6.31066 1.75184 6.5625 2.0625 6.5625H5.4375V9.9375C5.4375 10.2482 5.68934 10.5 6 10.5Z"
                fill="white"
              ></path>
            </svg>{" "}
          </button>
        </div>
        <div className="shelf-confirm-btn-div">
          <button className="shelf-confirm-btn" onClick={onClick}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 7.50017L7.49989 13.5001L13.9997 3.00024"
                stroke="#5C5C5C"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShelfCounter;
