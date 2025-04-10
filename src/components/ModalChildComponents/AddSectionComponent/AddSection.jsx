import React, { useState } from "react";
import "./AddSection.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  setSection,
  updateSectionDimensions,
} from "../../../slices/shelfDetailSlice";
import AddSectionDimensions from "./AddSectionDimensions";

const AddSection = ({ children, onClose }) => {
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const dispatch = useDispatch();
  const initialShelfCount = 3;
  const [shelfCount, setShelfCount] = useState(initialShelfCount);

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

  const [dimensions, setDimensions] = useState({
    width: 55,
    height: 100,
    depth: 20,
  });

  const handleAddShelfCount = (e) => {
    e.preventDefault();
    setShelfCount((prevData) => prevData + 1);
  };

  const handleSubShelfCount = (e) => {
    e.preventDefault();
    setShelfCount((prevData) => (prevData > 3 ? prevData - 1 : prevData));
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    // alert(`height: ${configurations.height}\n width: ${configurations.width}`);
    const positions = GeneratePosArr(dimensions.height, shelfCount);
    const racksCount = [dimensions.width];
    const shelfDepth = dimensions.depth;
    const sectionsCount = Object.keys(sections);
    const lastSectionKey = sectionsCount[sectionsCount.length - 1];
    const lastSection = sections[lastSectionKey];    
    if (dimensions.height > lastSection.height) {
      dispatch(
        updateSectionDimensions({
          sectionId: lastSectionKey,
          dimension: "standHeight",
          value: dimensions.height,
        })
      );
    }
    dispatch(setSection({racksCount,currShelfHeight:dimensions.height,shelfDepth,positions}));
      onClose();  
    
  };

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

  return (
    <>
      <AddSectionDimensions
        dimensions={dimensions}
        setDimensions={setDimensions}
      />
      <div className="dimension-note">
        The depth indicated above applies to the entire cabinet. It is possible
        that parts may be removed as a result of the resizing.
      </div>
      <div className="counter-button-div">
        <span className="add-shevles-label">Shelves</span>
        <div className="counter-container-div">
          <button
            className="counter-decreament-btn"
            disabled={shelfCount === initialShelfCount}
            onClick={handleSubShelfCount}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="counter-span">{shelfCount}</span>
          <button
            className="counter-increament-btn"
            onClick={handleAddShelfCount}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="button-div">
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
        <button className="add-button" onClick={handleAddSection}>
          Add
        </button>
      </div>
    </>
  );
};

export default AddSection;
