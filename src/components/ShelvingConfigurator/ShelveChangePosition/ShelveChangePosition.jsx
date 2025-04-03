/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";
import { updateShelvePostion } from "../../../slices/shelfDetailSlice";

const ShelveChangePosition = ({ sectionId, shelfKey }) => {
  const dispatch = useDispatch();
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const getCurrentShelvePosition =
    sections[sectionId]?.shelves[shelfKey]?.position;
  const getShelves = sections[sectionId]?.shelves;
  const shelvesKeys = Object.keys(getShelves);
  const getCurrentSectionHeight = sections[sectionId];
  const getBottomShelfPostionMax =
    shelfCountsAccHeight[getCurrentSectionHeight?.height]?.maxTop;

  const getShelvesKeys = shelvesKeys.map((key) => ({
    key,
    top: getShelves[key]?.position?.top,
  }));

  const selectedIndex = getShelvesKeys.findIndex(
    (shelf) => shelf.key === shelfKey
  );

  const currentPosition = parseFloat(getShelvesKeys[selectedIndex]?.top);
  const previousShelf = getShelvesKeys[selectedIndex - 1] || null;
  const nextShelf = getShelvesKeys[selectedIndex + 1] || null;
  const previousShelfTop = parseFloat(previousShelf?.top);
  const nextShelfTop = parseFloat(nextShelf?.top);
  const spaceBefore = previousShelf ? currentPosition - previousShelfTop : null;
  const spaceAfter = nextShelf ? nextShelfTop - currentPosition : null;
  const previousShelves = getShelvesKeys.slice(0, selectedIndex);
  const nextShelves = getShelvesKeys.slice(selectedIndex + 1);
  const previousSpaces = [];
  getShelvesKeys
    .map((shelf, index, arr) => {
      if (index === 0) return null;
      const top = parseFloat(shelf.top);
      const from = parseFloat(shelf.top) - currentPosition;
      console.log(index, "top---->", top,"currentPosition---->",  currentPosition, "from--->", from)
      if(top < currentPosition && top != 0){
      previousSpaces.push(top);
      }

      return {
        from: arr[index - 1].key,
        to: shelf.key,
        space: parseFloat(shelf.top) - currentPosition,
      };
    })
    .filter(Boolean);
    console.log(previousSpaces)
    console.log("spaceBefore--->",spaceBefore)
  const firstPreviousSpace = previousSpaces.find((space) => space > 8.75);

  // console.log(
  //   "Spaces Between Previous Shelves:",
  //   previousSpaces,
  //   firstPreviousSpace
  // );

  const [buttons, setButtons] = useState({
    topLeft: {
      active: false,
    },
    topRight: {
      active: false,
    },
    bottomLeft: {
      active: false,
    },
    bottomRight: {
      active: false,
    },
  });

  const buttonGlobalStyle =
    "mv_btns flex items-center border border-white  text-sm font-medium py-[5px] px-4 min-w-[108px] justify-center font-roboto ";
  useEffect(() => {
    getCurrentPosition();
  }, [shelfKey, sections]);

  const getCurrentPosition = () => {
    const topPosition = parseFloat(getCurrentShelvePosition?.top);
    const maxPostion = parseFloat(getBottomShelfPostionMax);
    setButtons((prev) => ({
      ...prev,
      topLeft: {
        ...prev.topLeft,
        active:
          topPosition != 0 &&
          topPosition != 3.75 && (
          spaceBefore >= 3.75 ||
          firstPreviousSpace >= 8.75),
      },
      topRight: {
        ...prev.topRight,
        active: topPosition != 0 && topPosition > 5 && spaceBefore >= 8.75,
      },
      bottomLeft: {
        ...prev.bottomLeft,
        active: topPosition < maxPostion - 3.75 && spaceAfter >= 3.75,
      },
      bottomRight: {
        ...prev.bottomRight,
        active: topPosition <= maxPostion - 8.75 && spaceAfter >= 5,
      },
    }));
  };

  const getFunctionPrevent = ({ type }) => {
    const getBottomPostionMax = parseFloat(getBottomShelfPostionMax);
    const getAnyNotLast = shelvesKeys.find((item) => {
      const top = parseFloat(getShelves[item]?.position?.top);
      return getBottomPostionMax === top;
    });

    if ((type == "topLeft" || type == "topRight") && (spaceBefore >= 3.75 || firstPreviousSpace >= 8.75)) {

      const currentPosition = parseFloat(getCurrentShelvePosition?.top);
      const gap = type == "topRight" ? 5 : firstPreviousSpace >= 8.75 && spaceBefore <= 3.75  ? 10 : 1.25;
      
      const newCurrentPosition = currentPosition - gap;

      if (3.75 <= newCurrentPosition) {
        dispatch(
          updateShelvePostion({
            sectionId: sectionId,
            position: newCurrentPosition,
            shelfKey: shelfKey,
          })
        );
      }
      else if(firstPreviousSpace >= 8.75){  
        dispatch(
          updateShelvePostion({
            sectionId: sectionId,
            position: newCurrentPosition,
            shelfKey: shelfKey,
          })
        );
      }
    }
    if ((type == "bottomLeft" || type == "bottomRight") && spaceAfter >= 3.75) {
      const currentPosition = parseFloat(getCurrentShelvePosition?.top);
      const gap = type == "bottomRight" ? 5 : 1.25;
      const newCurrentPosition = currentPosition + gap;
      if (getBottomPostionMax - 3.75 >= newCurrentPosition || !getAnyNotLast) {
        dispatch(
          updateShelvePostion({
            sectionId: sectionId,
            position: newCurrentPosition,
            shelfKey: shelfKey,
          })
        );
      }
    }
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        <button
          onClick={(e) => getFunctionPrevent({ type: "topLeft" })}
          className={
            buttonGlobalStyle +
            `${
              buttons?.topLeft?.active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            }   rounded-l-sm`
          }
        >
          <svg viewBox="0 0 16 16" className="mr-2 w-4 h-4 pointer-events-none">
            <path
              fill="#fff"
              d="M1.636 10.364a1 1 0 001.414 1.414L8 6.828l4.95 4.95a1 1 0 101.414-1.414L8 4l-6.364 6.364z"
            ></path>
          </svg>
          <span className="pointer-events-none">2.5 cm</span>
        </button>
        <button
          onClick={(e) => getFunctionPrevent({ type: "topRight" })}
          className={
            buttonGlobalStyle +
            `${
              buttons?.topRight?.active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            }   rounded-r-sm`
          }
        >
          <svg viewBox="0 0 16 16" className="mr-2 w-4 h-4 pointer-events-none">
            <path
              fill="#fff"
              d="M3.05 8.849L8 3.899l4.95 4.95a1 1 0 101.414-1.414L8 1.07 1.636 7.435A1 1 0 003.05 8.849zm0 6L8 9.899l4.95 4.95a1 1 0 101.414-1.414L8 7.07l-6.364 6.364a1 1 0 001.414 1.414z"
            ></path>
          </svg>
          <span className="pointer-events-none">10 cm</span>
        </button>
      </div>
      <div className="flex">
        <button
          onClick={(e) => getFunctionPrevent({ type: "bottomLeft" })}
          className={
            buttonGlobalStyle +
            `${
              buttons?.bottomLeft?.active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            }   rounded-l-sm`
          }
        >
          <svg viewBox="0 0 16 16" className="mr-2 w-4 h-4 pointer-events-none">
            <path
              fill="#fff"
              d="M1.636 5.707A1 1 0 013.05 4.293L8 9.243l4.95-4.95a1 1 0 111.414 1.414L8 12.071 1.636 5.707z"
            ></path>
          </svg>

          <span className="pointer-events-none">2.5 cm</span>
        </button>
        <button
          onClick={(e) => getFunctionPrevent({ type: "bottomRight" })}
          className={
            buttonGlobalStyle +
            `${
              buttons?.bottomRight?.active
                ? "bg-blue-1000 text-white"
                : "bg-light-1000 text-light-1001"
            }   rounded-r-sm`
          }
        >
          <svg viewBox="0 0 16 16" className="mr-2 w-4 h-4 pointer-events-none">
            <path
              fill="#fff"
              d="M3.05 7.364L8 12.314l4.95-4.95a1 1 0 111.414 1.414L8 15.142 1.636 8.778A1 1 0 013.05 7.364zm0-6L8 6.314l4.95-4.95a1 1 0 111.414 1.414L8 9.142 1.636 2.778A1 1 0 013.05 1.364z"
            ></path>
          </svg>
          <span className="pointer-events-none">10 cm</span>
        </button>
      </div>
    </div>
  );
};

export default ShelveChangePosition;
