/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";
import {
  updateShelveIndexAndPostion,
  updateShelvePostion,
} from "../../../slices/shelfDetailSlice";

const ShelveChangePosition = ({ sectionId, shelfKey }) => {
  const [btnType, setBtnType] = useState("intial");
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

  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });
  const activeDeactiveBtns = () => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const maxBottom = getBottomShelfPostionMax;
    const previousShelve = prevShelves(topPosition);
    const nextShelve = nextShelves(topPosition);
    const previous = previousShelve.sort((a, b) => b.shelveTop - a.shelveTop);
    const next = nextShelve.sort((a, b) => a.shelveTop - b.shelveTop);
    const largest = getShelvesKeys.reduce(
      (max, item) => (item.top > max.top ? item : max),
      getShelvesKeys[0]
    );
    const lowest = getShelvesKeys.reduce(
      (min, item) => (item.top < min.top ? item : min),
      getShelvesKeys[0]
    );

    const nextElementSpace = next.find(
      (item) =>
        item.space >=
        (btnType.includes("Left") || btnType.includes("intial") ? 3.75 : 8.75)
    );
    const prevElementSpace = previous.find(
      (item) =>
        item.space >=
        (btnType.includes("Left") || btnType.includes("intial") ? 3.75 : 8.75)
    );

    setButtons((prev) => ({
      ...prev,
      topLeft: {
        ...prev.topLeft,
        active:
          shelfKey == lowest.key && lowest.top > 0
            ? true
            : previous[0]?.space >= 3.75
            ? true
            : prevElementSpace?.space > 3.75
            ? true
            : false,
      },
      topRight: {
        ...prev.topRight,
        active:
          shelfKey == lowest.key && lowest.top > 3.75
            ? true
            : prevElementSpace
            ? previous[0]?.space < 8.75
              ? previous.length < 3
                ? false
                : true
              : prevElementSpace.space > 8.75
            : false,
      },
      bottomLeft: {
        ...prev.bottomLeft,
        active:
          shelfKey == largest.key && largest.top < maxBottom
            ? true
            : nextElementSpace
            ? next[0]?.space >= 3.75
              ? true
              : nextElementSpace.space > 3.75
              ? true
              : false
            : false,
      },
      bottomRight: {
        ...prev.bottomRight,
        active:
          shelfKey == largest.key && largest.top < maxBottom - 3.75
            ? true
            : nextElementSpace
            ? next[0]?.space < 8.75
              ? true
              : nextElementSpace.space > 8.75
            : false,
      },
    }));
  };
  useEffect(() => {
    activeDeactiveBtns();
  }, [shelfKey, sections]);
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
    setBtnType(type);
    const largest = getShelvesKeys.reduce(
      (max, item) => (item.top > max.top ? item : max),
      getShelvesKeys[0]
    );
    const lowest = getShelvesKeys.reduce(
      (min, item) => (item.top < min.top ? item : min),
      getShelvesKeys[0]
    );
    const gap = type.includes("Right") ? 5 : 1.25;
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const currentTop = parseFloat(getCurrentShelvePosition?.top);
    const maxBottom = getBottomShelfPostionMax;
    let newPosition = type.includes("top")
      ? currentTop - gap
      : currentTop + gap;
    const previousShelve = prevShelves(topPosition);
    const nextShelve = nextShelves(topPosition);
    const sortedPrevShelves = previousShelve.sort(
      (a, b) => b.shelveTop - a.shelveTop
    );
    const sortedNextShelves = nextShelve.sort(
      (a, b) => a.shelveTop - b.shelveTop
    );
    const findPrevElementSpace = sortedPrevShelves.find(
      (item) => item.space >= (type.includes("topLeft") ? 5 : 8.75)
    );
    const nextElementSpaceJump = sortedNextShelves.find(
      (item) => item.space >= (type.includes("bottomLeft") ? 5 : 8.75)
    );

    if (type.includes("top")) {
      if (
        sortedPrevShelves[0]?.space < 5 &&
        sortedPrevShelves[0]?.space >= 1.25
      ) {
        const theGap = sortedPrevShelves[0]?.space - 3.75;
        if (theGap >= 1.25 && shelfKey != lowest.key) {
          newPosition = newPosition - (theGap - 1.25);
        } else {
          newPosition = newPosition - theGap;
        }
      }
    }
    if (type.includes("bottom")) {
      if (sortedNextShelves[0]?.space < 5) {
        const theGap = sortedNextShelves[0]?.space - 3.75;

        if (theGap >= 1.25) {
          newPosition = newPosition - (theGap - 1.25);
        }
      }
    }
    newPosition =
      newPosition < 3.75
        ? shelfKey == lowest.key
          ? newPosition
          : 3.75
        : newPosition;

    if (
      type.includes("topLeft") &&
      (shelfKey == lowest.key ? true : sortedPrevShelves[0]?.space > 3.75) &&
      (shelfKey == lowest.key ? true : newPosition >= 3.75)
    ) {
      newPosition = shelfKey == lowest.key ? newPosition - 1.25 : newPosition;
      dispatch(
        updateShelvePostion({
          sectionId,
          position: newPosition <= 1.25 ? 0 : newPosition,
          shelfKey,
        })
      );
    } else if (
      type.includes("topRight") &&
      (shelfKey == lowest.key ? true : sortedPrevShelves[0]?.space >= 8.75) &&
      (shelfKey == lowest.key ? true : newPosition >= 3.75)
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (sortedPrevShelves[0]?.space <= 8.75 && type.includes("top")) {
      if (findPrevElementSpace && findPrevElementSpace?.space >= 5) {
        const jumpPostion =
          findPrevElementSpace.shelveTop -
          (type == "topRight" ? findPrevElementSpace?.space / 2 : 3.75);
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
      (shelfKey == largest.key
        ? true
        : sortedNextShelves[0]?.space - 1.25 >= 3.75) &&
      newPosition <= maxBottom
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (
      type.includes("bottomRight") &&
      (shelfKey == largest.key ? true : sortedNextShelves[0]?.space >= 8.75) &&
      (shelfKey == largest.key ? true : newPosition >= 3.75) &&
      newPosition <= maxBottom
    ) {
      dispatch(
        updateShelvePostion({ sectionId, position: newPosition, shelfKey })
      );
    } else if (sortedNextShelves[0]?.space <= 8.75 && type.includes("bottom")) {
      if (nextElementSpaceJump && nextElementSpaceJump.space >= 5) {
        const jumpPostion =
          nextElementSpaceJump.shelveTop +
          (type == "bottomRight" ? nextElementSpaceJump?.space / 2 : 3.75);
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

export default ShelveChangePosition;
