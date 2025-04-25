import React, { useEffect, useState } from "react";
import "./AddSection.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  setSection,
  updateSectionDimensions,
} from "../../../slices/shelfDetailSlice";

import AddSectionDimensions from "./AddSectionDimensions";
import { setWoodSection, updateWoodSectionDimensions } from "../../../slices/WoodShelfDetailSlice";

const AddSection = ({ children, onClose }) => {
  const material = useSelector((state)=>state.shelfDetail.racks.execution.material);
  const sections = material == "metal"? 
  useSelector((state) => state.shelfDetail.racks.sections) :
  useSelector((state)=>state.woodShelfDetail.racks.sections);

  const dimension =  material == "metal" ? 
  useSelector((state) => state.shelfDetail.racks):
  useSelector((state) => state.woodShelfDetail.racks);

  const dispatch = useDispatch();
  const initialShelfCount = 3;
  const [shelfCount, setShelfCount] = useState(initialShelfCount);

  const heightArr = [
    {90:"52"},
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
    width: material == "metal" ? 55 : 60,
    height: material == "metal" ? 100 : 90,
    depth: material == "metal" ? 20 : 30,
  });
  useEffect(() => {
    setDimensions((prev) => ({ ...prev, depth: dimension?.depth }));
  }, []);
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
      if(material == "metal"){
        dispatch(
          updateSectionDimensions({
            sectionId: lastSectionKey,
            dimension: "standHeight",
            value: dimensions.height,
          })
        );
      }else{
        dispatch(
          updateWoodSectionDimensions({
            sectionId: lastSectionKey,
            dimension: "standHeight",
            value: dimensions.height,
          })
        );
      }
    }

    if(material == "metal"){
      dispatch(setSection({
        racksCount,
          currShelfHeight: dimensions.height,
          shelfDepth,
          positions
      }))
    }else{
      dispatch(setWoodSection({
        racksCount,
          currShelfHeight: dimensions.height,
          shelfDepth,
          positions,
          fromSelect:false
      }))
    }
    
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
        material = {material}
      />
      <div className="dimension-note font-inter !text-[12px] !border-[#00008B] !text-[#fff] !bg-[#00008B]">
        De diepte die hierboven is aangegeven geldt voor de gehele kast. 
        Het is mogelijk dat er onderdelen verwijderd worden als gevolg van het wijzigen van de afmetingen.
      </div>
      <div className="counter-button-div">
        <span className="add-shevles-label !font-inter">Legborden</span>
        <div className="counter-container-div">
          <button
            className="counter-decreament-btn !font-inter"
            disabled={shelfCount === initialShelfCount}
            onClick={handleSubShelfCount}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="counter-span !font-inter">{shelfCount}</span>
          <button
            className="counter-increament-btn !font-inter"
            onClick={handleAddShelfCount}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>
      <div className="button-div ">
        <button className="close-button !font-inter" onClick={onClose}>
          Annuleren
        </button>
        <button className="add-button !font-inter" onClick={handleAddSection}>
          Toevoegen
        </button>
      </div>
    </>
  );
};

export default AddSection;
