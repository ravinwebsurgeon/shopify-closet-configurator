'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSlidingDoorHighlighted,
  updateSlidingDoor,
} from "../../slices/shelfDetailSlice";

const SlidingDoorMoveButton = () => {
  const dispatch = useDispatch();
  const isSlidingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isSlidingDoorHighlighted
  );
  const sections = useSelector((state) => state.shelfDetail.racks.sections);

  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const shelves = sections[selectedSectionKey].shelves;
  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });
  useEffect(() => {
    handlePositionChange();
  }, [isSlidingDoorHighlighted, shelves]);
  const handlePositionChange = (type) => {
    const shelfs = Object.entries(shelves).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      type: value?.type || null,
      position:
        key?.includes("slidingDoors") || key?.includes("revolvingDoors_")
          ? value?.position
          : parseFloat(value?.position?.top),
    }));
    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("drawer_") && !item?.key.includes("compartment")
    );
    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const h =
          fromKey && fromKey?.key.includes("slidingDoors")
            ? 22.5
            : fromKey && fromKey?.key.includes("revolvingDoors_")
            ? fromKey?.height
            : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isSlidingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);
    const findPrev = spaceBetweenShelves?.filter(
      (item) => item.type === "prev"
    );
    const findNext = spaceBetweenShelves
      ?.filter((item) => item.type === "next")
      .sort((a, b) => a.toPosition - b.toPosition);
    setButtons({
      topLeft: { active: findPrev[0]?.space > 1.25 },
      topRight: { active: findPrev[0]?.space > 1.25 },
      bottomLeft: { active: findNext[0]?.space >= 1.25 },
      bottomRight: { active: findNext[0]?.space >= 1.25 },
    });
    if (type) {
      if (type.includes("Left")) {
        const gap = type == "topLeft" ? 1.25 : -1.25;
        const newPosition = isSlidingDoorHighlighted?.position - gap;
        if (newPosition >= 0 && findNext[0].toPosition - 22.5 >= newPosition) {
          dispatch(
            updateSlidingDoor({
              sectionId: selectedSectionKey,
              position: newPosition,
              doorKey: isSlidingDoorHighlighted?.id,
            })
          );
          dispatch(
            setSlidingDoorHighlighted({
              id: isSlidingDoorHighlighted?.id,
              position: newPosition,
              type: isSlidingDoorHighlighted?.type,
            })
          );
        }
      }
      if (type.includes("Right")) {
        const gap = type == "topRight" ? 5 : -5;
        let newPosition = isSlidingDoorHighlighted?.position - gap;
        if (newPosition <= findPrev[0].fromPosition && type == "topRight") {
          newPosition = findPrev[0].fromPosition + 1.25;
        }
        if (
          newPosition >= findNext[0].toPosition - 22.5 &&
          type == "bottomRight"
        ) {
          newPosition = findNext[0].toPosition - 22.5;
        }

        if (newPosition >= 0 && findNext[0].toPosition - 22.5 >= newPosition) {
          dispatch(
            updateSlidingDoor({
              sectionId: selectedSectionKey,
              position: newPosition,
              doorKey: isSlidingDoorHighlighted?.id,
            })
          );
          dispatch(
            setSlidingDoorHighlighted({
              id: isSlidingDoorHighlighted?.id,
              position: newPosition,
              type: isSlidingDoorHighlighted?.type,
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

export default SlidingDoorMoveButton;
