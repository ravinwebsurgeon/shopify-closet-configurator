/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";
import {
  updateShelveIndexAndPostion,
  updateShelvePostion,
} from "../../../slices/shelfDetailSlice";

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
  const nextShelf = getShelvesKeys[selectedIndex + 1] || null;
  const nextShelfTop = nextShelf?.top || 0;
  const spaceAfter = nextShelf ? nextShelfTop - currentPosition : 0;

  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });

  const activeDeactiveBtns = () => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const previousShelve = prevShelves(topPosition);
    const nextShelve = nextShelves(topPosition);
    const previous = previousShelve.sort((a, b) => b.shelveTop - a.shelveTop);
    const next = nextShelve.sort((a, b) => a.shelveTop - b.shelveTop);
    const nextElementSpace = next.find((item) => item.space >= 3.75);
    const prevElementSpace = previous.find((item) => item.space >= 3.75);
    setButtons((prev) => ({
      ...prev,
      topLeft: {
        ...prev.topLeft,
        active:
          shelfKey == getShelvesKeys[0].key && topPosition > 0
            ? true
            : prevElementSpace
            ? prevElementSpace.space >= 3.75
            : false,
      },
      topRight: {
        ...prev.topRight,
        active:
          shelfKey == getShelvesKeys[0].key && topPosition > 0
            ? true
            : prevElementSpace
            ? prevElementSpace.space >= 5
            : false,
      },
      bottomLeft: {
        ...prev.bottomLeft,
        active: nextElementSpace ? nextElementSpace.space >= 3.75 : false,
      },
      bottomRight: {
        ...prev.bottomRight,
        active: nextElementSpace ? nextElementSpace.space >= 5 : false,
      },
    }));
  };
  useEffect(() => {
    activeDeactiveBtns();
  }, [shelfKey]);
  useEffect(() => {}, [getShelvesKeys]);
  const prevShelves = (topPosition) => {
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
  const nextShelves = (topPosition) => {
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
  useEffect(() => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    setSpaces((prev) => ({
      ...prev,
      prevShelves: prevShelves(topPosition),
      nextShelves: nextShelves(topPosition),
    }));
  }, [sections, shelfKey]);

  const handlePositionChange = (type) => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const previousShelve = prevShelves(topPosition);
    const nextShelve = nextShelves(topPosition);
    const sortedPrevShelves = previousShelve.sort(
      (a, b) => b.shelveTop - a.shelveTop
    );
    const sortedNextShelves = nextShelve.sort(
      (a, b) => a.shelveTop - b.shelveTop
    );
    const findPrevElementSpace = sortedPrevShelves.find(
      (item) => item.space >= 5
    );
    const currentTop = parseFloat(getCurrentShelvePosition?.top);
    const maxBottom = getBottomShelfPostionMax;
    const gap = type.includes("Right") ? 5 : 1.25;
    let newPosition = type.includes("top")
      ? currentTop - gap
      : currentTop + gap;
    const nextElementSpaceJump = sortedNextShelves.find(
      (item) => item.space >= 8.75
    );
    if (type.includes("top")) {
      if (sortedPrevShelves[0]?.space <= 5) {
        const theGap = sortedPrevShelves[0]?.space - 3.75;

        if (theGap >= 1.25) {
          newPosition = newPosition - (theGap - 1.25);
        }
      }
    }
    if (type.includes("bottom")) {
      if (sortedNextShelves[0]?.space <= 5) {
        const theGap = sortedNextShelves[0]?.space - 3.75;

        if (theGap >= 1.25) {
          newPosition = newPosition - (theGap - 1.25);
        }
      }
    }

    activeDeactiveBtns();
    console.log(
      "sortedPrevShelves-->",
      sortedPrevShelves,
      findPrevElementSpace,
      sortedPrevShelves[0]?.space - 1.25 >= 3.75,
      sortedPrevShelves[0]?.space - 1.25
    );
    if (
      type.includes("topLeft") &&
      (shelfKey == getShelvesKeys[0].key
        ? true
        : sortedPrevShelves[0]?.space > 3.75) &&
      (shelfKey == getShelvesKeys[0].key ? true : newPosition >= 3.75)
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (
      type.includes("topRight") &&
      (shelfKey == getShelvesKeys[0].key
        ? true
        : sortedPrevShelves[0]?.space > 5) &&
      (shelfKey == getShelvesKeys[0].key ? true : newPosition >= 3.75)
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (sortedPrevShelves[0]?.space <= 8.75 && type.includes("top")) {
      console.log(
        "sortedPrevShelves-->",
        sortedPrevShelves,
        findPrevElementSpace
      );
      if (findPrevElementSpace && findPrevElementSpace.space >= 5) {
        const jumpPostion =
          findPrevElementSpace.shelveTop - (type == "topRight" ? 10 : 3.75);
        dispatch(
          updateShelvePostion({ sectionId, position: jumpPostion, shelfKey })
        );
        const sortedShelves = shelvesKeys
          .map((item) => ({
            key: item,
            top:
              item === shelfKey
                ? jumpPostion
                : parseFloat(getShelves[item]?.position?.top) || 0,
          }))
          .sort((a, b) => a.top - b.top)
          .map((shelf) => shelf);
        dispatch(
          updateShelveIndexAndPostion({ sectionId, shelves: sortedShelves })
        );
      }
    } else if (
      type.includes("bottomLeft") &&
      (shelfKey == getShelvesKeys[getShelvesKeys.length - 1].key
        ? true
        : sortedNextShelves[0]?.space - 1.25 >= 3.75) &&
      newPosition <= maxBottom
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (
      type.includes("bottomRight") &&
      (shelfKey == getShelvesKeys[getShelvesKeys.length - 1].key
        ? true
        : sortedNextShelves[0]?.space > 5) &&
      (shelfKey == getShelvesKeys[getShelvesKeys.length - 1].key
        ? true
        : newPosition >= 3.75) &&
      newPosition <= maxBottom
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (sortedNextShelves[0]?.space <= 8.75 && type.includes("bottom")) {
      if (nextElementSpaceJump && nextElementSpaceJump.space >= 5) {
        const jumpPostion =
          nextElementSpaceJump.shelveTop + (type == "bottomRight" ? 5 : 3.75);
        dispatch(
          updateShelvePostion({ sectionId, position: jumpPostion, shelfKey })
        );
        const sortedShelves = shelvesKeys
          .map((item) => ({
            key: item,
            top:
              item === shelfKey
                ? jumpPostion
                : parseFloat(getShelves[item]?.position?.top) || 0,
          }))
          .sort((a, b) => a.top - b.top)
          .map((shelf) => shelf);
        dispatch(
          updateShelveIndexAndPostion({ sectionId, shelves: sortedShelves })
        );
      }
    }
  };

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
