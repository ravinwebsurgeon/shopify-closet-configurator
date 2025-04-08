/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";
import { updateShelvePostion } from "../../../slices/shelfDetailSlice";

const ShelveChangePosition = ({ sectionId, shelfKey }) => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const [spaces, setSpaces] = useState({
    prevShelves: [],
    nextShelves: [],
  });
  const getCurrentShelvePosition =
    sections[sectionId]?.shelves[shelfKey]?.position;
  const getShelves = sections[sectionId]?.shelves;
  const shelvesKeys = Object.keys(getShelves);

  const getCurrentSectionHeight = sections[sectionId];
  const getBottomShelfPostionMax = parseFloat(
    shelfCountsAccHeight[getCurrentSectionHeight?.height]?.maxTop
  );

  const getShelvesKeys = useMemo(
    () =>
      shelvesKeys.map((key) => ({
        key,
        top: parseFloat(getShelves[key]?.position?.top),
      })),
    [getShelves]
  );

  const selectedIndex = getShelvesKeys.findIndex(
    (shelf) => shelf.key === shelfKey
  );
  const currentPosition = getShelvesKeys[selectedIndex]?.top || 0;

  const previousShelf = getShelvesKeys[selectedIndex - 1] || null;
  const nextShelf = getShelvesKeys[selectedIndex + 1] || null;

  const previousShelfTop = previousShelf?.top || 0;
  const nextShelfTop = nextShelf?.top || 0;

  const spaceBefore = previousShelf ? currentPosition - previousShelfTop : 0;
  const spaceAfter = nextShelf ? nextShelfTop - currentPosition : 0;

  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });

  useEffect(() => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const maxPosition = getBottomShelfPostionMax;
    const prevShelves = () => {
      return shelvesKeys
        .map((item, index, array) => {
          const shelveTop = parseFloat(getShelves[item]?.position?.top);
          const prevItem = array
            .filter(
              (prev) => parseFloat(getShelves[prev]?.position?.top) < shelveTop
            )
            .sort(
              (a, b) =>
                parseFloat(getShelves[b]?.position?.top) -
                parseFloat(getShelves[a]?.position?.top)
            )[0];
          const prevShelveTop =
            parseFloat(getShelves[prevItem]?.position?.top) || 0;
          return shelveTop <= topPosition
            ? { shelveTop, space: shelveTop - prevShelveTop, item, prevItem }
            : null;
        })
        .filter((pos) => pos !== null);
    };
    const nextShelves = () => {
      return shelvesKeys
        .map((item, index, array) => {
          const shelveTop = parseFloat(getShelves[item]?.position?.top);
          const nextItem = array
            .filter(
              (next) => parseFloat(getShelves[next]?.position?.top) > shelveTop
            )
            .sort(
              (a, b) =>
                parseFloat(getShelves[a]?.position?.top) -
                parseFloat(getShelves[b]?.position?.top)
            )[0];

          if (!nextItem) return null;
          const nextShelveTop = parseFloat(getShelves[nextItem]?.position?.top);
          return shelveTop >= topPosition
            ? {
                shelveTop,
                space: nextShelveTop - shelveTop,
                item,
                nextItem,
              }
            : null;
        })
        .filter((pos) => pos !== null);
    };
    setSpaces((prev) => ({
      ...prev,
      prevShelves: prevShelves(),
      nextShelves: nextShelves(),
    }));
    setButtons((prev) => ({
      ...prev,
      topLeft: { active: topPosition > 3.75 && spaceBefore >= 3.75 },
      topRight: { active: topPosition > 5 && spaceBefore >= 8.75 },
      bottomLeft: {
        active: topPosition < maxPosition - 3.75,
      },
      bottomRight: {
        active: topPosition <= maxPosition - 8.75,
      },
    }));
  }, [shelfKey]);

  const handlePositionChange = (type) => {
    const currentTop = parseFloat(getCurrentShelvePosition?.top);
    const maxBottom = getBottomShelfPostionMax;
    const gap = type.includes("Right") ? 5 : 1.25;
    const sortedPrevShelves = spaces?.prevShelves.sort(
      (a, b) => b.shelveTop - a.shelveTop
    );
    const findPrevElementSpace = sortedPrevShelves.find(
      (item) => item.space >= 5
    );

    let newPosition = type.includes("top")
      ? currentTop - gap
      : currentTop + gap;
    const prevPostion = newPosition - findPrevElementSpace?.shelveTop || 3.75;
    console.log("findPrevElementSpace", findPrevElementSpace);
    console.log("sortedPrevShelves", sortedPrevShelves);
    console.log("prevPostion", prevPostion);
    console.log("newPosition", newPosition);
    // if (prevPostion < 3.75) {
    //   newPosition = type.includes("top")
    //     ? findPrevElementSpace.shelveTop - 5
    //     : currentTop + gap;
    //   dispatch(
    //     updateShelvePostion({ sectionId, position: newPosition, shelfKey })
    //   );
    // }

    console.log(newPosition, prevPostion, findPrevElementSpace);
    if (
      (type.includes("top") && shelfKey == "shelves_1" ? true : (
        sortedPrevShelves[0]?.space >= 3.75 ) && shelfKey == "shelves_1" ? true :
        newPosition >= 3.75) ||
      (type.includes("bottom") &&
        spaceAfter >= 3.75 &&
        newPosition <= maxBottom - 3.75)
    ) {
      
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
      // setButtons((prev) => ({
      //   ...prev,
      //   topLeft: { active: topPosition > 3.75 && sortedPrevShelves[0]?.space >= 3.75 }     
      // }));
    }
  };
  useEffect(() => {
    console.log(spaces);
  }, [spaces]);
  const buttonStyle =
    "mv_btns flex items-center border border-white text-sm font-medium py-[5px] px-4 min-w-[108px] justify-center font-roboto ";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {["topLeft", "topRight"].map((type, index) => (
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

export default ShelveChangePosition;
