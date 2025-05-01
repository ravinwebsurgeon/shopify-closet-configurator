/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsWardrobeHighlighted,
  updateWardrobePosition,
} from "../../slices/shelfDetailSlice";
const WardrobeRodsChangePosition = ({ selected }) => {
  const dispatch = useDispatch();

  const sections = useSelector((state) => state.shelfDetail.racks.sections);

  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });
  const shelvesKeys = Object.keys(shelves) || [];

  const { filteredShelfs } = useMemo(() => {
    if (!sections || !selectedSectionKey) return { filteredShelfs: [] };
    console.log(sections[selectedSectionKey]?.shelves);
    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      type: value?.type || null,
      position: key?.includes("compartment")
        ? parseFloat(value?.compartments?.position?.top || 0)
        : key?.includes("drawer")
        ? parseFloat(value?.drawer?.position?.top || 0)
        : parseFloat(value?.position?.top || 0),
    }));
    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("slidingDoors") ||
        !item?.key.includes("revolvingDoors_")
    );

    return { filteredShelfs };
  }, [sections, selectedSectionKey]);
  useEffect(() => {
    if (selected) {
      handlePositionChange();
    }
  }, [selected, shelves]);
  const handlePositionChange = (type) => {
    const position = parseFloat(selected?.position); 
    // console.log("handlePositionChange", filteredShelfs);
    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const changePoitsion = item?.key?.includes("compartment")
          ? 15
          : fromKey?.key?.includes("drawer")
          ? 5
          : fromKey?.key?.includes("wardrobe_")
          ? 25
          : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          type: item?.position <= position ? "prev" : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          space: item?.position - fromKey?.position - changePoitsion,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);
    console.log("spaceBetweenShelves", spaceBetweenShelves);
    const filterPrev = spaceBetweenShelves
      .filter((item) => item.type === "prev")
      .sort((a, b) => b.toPosition - a.toPosition);
    // console.log(spaceBetweenDoors);
    const filterNext = spaceBetweenShelves
      .filter((item) => item.type === "next")
      .sort((a, b) => a.toPosition - b.toPosition);
    const findNext = filterNext.find(
      (item) => item.type === "next" && item?.space >= 12.5
    );
    const findPrev = filterPrev.find(
      (item) => item.type === "prev" && item?.space >= 12.5
    );
    const findACPrev = filterPrev.find(
      (item) => item.type === "prev" && item?.to == selected?.key
    );
    const findACNext = filterNext.find(
      (item) => item.type === "next" && item?.from == selected?.key
    );
    setButtons({
      topLeft: {
        active: findACPrev?.space > 1.25 || findPrev?.space >= 12.5,
      },
      topRight: {
        active: findACPrev?.space > 1.25 || findPrev?.space >= 12.5,
      },
      bottomLeft: {
        active: findACNext?.space > 1.25 || findNext?.space >= 12.5,
      },
      bottomRight: {
        active: findACNext?.space > 1.25 || findNext?.space >= 12.5,
      },
    });

    if (type) {
      const currentPostion = parseFloat(shelves[selected.key]?.position?.top);
      if (type.includes("Left")) {
        let newPostion = type.includes("top")
          ? currentPostion - 1.25
          : currentPostion + 1.25;
        let jump = false;
        let jumpSpace = 6.25;

        if (findACPrev?.space <= 1.25 && type.includes("top")) {
          if (findPrev.to.includes("compartment")) {
            jumpSpace = 15;
          }
          newPostion = findPrev?.toPosition - jumpSpace;
          jump = true;
        }
        if (findACNext?.space <= 1.25 && type.includes("bottom")) {
          newPostion = findNext?.fromPosition + 3.75;
          jump = true;
        }
        if (newPostion > 0) {
          dispatch(
            updateWardrobePosition({
              sectionId: selectedSectionKey,
              shelfKey: selected?.key,
              top: newPostion,
              jump: jump,
            })
          );
          setIsWardrobeHighlighted({
            key: selected?.key,
            position: newPostion,
          });
        }
      }
      if (type.includes("Right")) {
        let newPostion = type.includes("top")
          ? currentPostion - 5
          : currentPostion + 5;
        let jump = false;
        let jumpSpace = 6.25;
        if (findACPrev?.space <= 5 && type.includes("top")) {
          if (findPrev.to.includes("compartment")) {
            jumpSpace = 15;
          }
          newPostion = findPrev?.toPosition - jumpSpace;
          jump = true;
        }
        if (findACNext?.space <= 5 && type.includes("bottom")) {
          newPostion = findNext?.fromPosition + 3.75;
          jump = true;
        }
        if (newPostion) {
          dispatch(
            updateWardrobePosition({
              sectionId: selectedSectionKey,
              key: selected?.key,
              top: newPostion,
              jump: jump,
            })
          );
        }
      }
    }
  };

  const buttonStyle =
    "mv_btns flex items-center border border-white text-sm font-medium py-[5px] px-4 min-w-[108px] justify-center font-inter ";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {["topLeft", "topRight"].map((type, index) => (
          <button
            key={type}
            onClick={() =>
              buttons[type].active ? handlePositionChange(type) : ""
            }
            className={`${buttonStyle} ${
              buttons[type].active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            } ${index === 0 ? "rounded-l-sm" : "rounded-r-sm"}`}
          >
            <svg
              viewBox="0 0 16 16"
              className="mr-2 w-4 h-4 pointer-events-none"
            >
              <path
                fill="#fff"
                d="M1.636 10.364a1 1 0 001.414 1.414L8 6.828l4.95 4.95a1 1 0 101.414-1.414L8 4l-6.364 6.364z"
              ></path>
            </svg>
            <span className="pointer-events-none">
              {type === "topLeft" ? "2.5 cm" : "10 cm"}
            </span>
          </button>
        ))}
      </div>

      <div className="flex">
        {["bottomLeft", "bottomRight"].map((type, index) => (
          <button
            key={type}
            onClick={() => handlePositionChange(type)}
            className={`${buttonStyle} ${
              buttons[type].active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            } ${index === 0 ? "rounded-l-sm" : "rounded-r-sm"}`}
          >
            <svg
              viewBox="0 0 16 16"
              className="mr-2 w-4 h-4 pointer-events-none"
            >
              <path
                fill="#fff"
                d="M1.636 5.707A1 1 0 013.05 4.293L8 9.243l4.95-4.95a1 1 0 111.414 1.414L8 12.071 1.636 5.707z"
              ></path>
            </svg>
            <span className="pointer-events-none">
              {type === "bottomLeft" ? "2.5 cm" : "10 cm"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WardrobeRodsChangePosition;
