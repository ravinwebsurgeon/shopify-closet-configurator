/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCompartment,
  removeCompartment,
  setCompartmentHighlighted,
  updateCompartmentPostion,
} from "../../slices/shelfDetailSlice";

const CompartmentsMoveButton = ({ selected }) => {
  const dispatch = useDispatch();
  const [spaces, setSpaces] = useState({
    spaces: "",
    findPrev: "",
    findNext: "",
  });
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  const getAvailbleShelve = () => {
    const shelvesKeys = Object.keys(shelves);
    const spaces = shelvesKeys
      .map((shelf, index, arr) => {
        if (index === 0) return null;

        const fromKey = arr[index - 1];
        const fromTop = parseFloat(shelves[fromKey]?.position?.top);
        const selectedTop =
          shelves[selected?.shelfkey]?.compartments?.position?.top ||
          shelves[selected?.shelfkey]?.position?.top;
        const shelftop = parseFloat(
          shelves[shelf]?.compartments?.position?.top ||
            shelves[shelf]?.position?.top
        );
        const compartments = shelves[shelf]?.compartments;
        if (index === 0) return null;
        return {
          postions:
            parseFloat(selectedTop) < shelftop
              ? "next"
              : parseFloat(selectedTop) == shelftop
              ? "current"
              : "prev",
          from: fromKey,
          to: shelf,
          index: index,
          space: shelftop - fromTop,
          compartments: compartments ? true : false,
          shelfTop: shelftop,
        };
      })
      .filter(Boolean);
    return spaces || null;
  };
  const availbleShelve = () => {
    const getSpaces = getAvailbleShelve();

    const findNext = getSpaces.find(
      (item) =>
        item.postions == "next" && item.space >= 12.5 && !item?.compartments
    );
    const findPrev = getSpaces
      .sort((a, b) => b.index - a.index)
      .find(
        (item) =>
          item.postions == "prev" && item.space >= 12.5 && !item?.compartments
      );
    setSpaces({
      spaces: spaces,
      findPrev: findPrev,
      findNext: findNext,
    });
  };
  useEffect(() => {
    availbleShelve();
  }, [selected]);

  const changePostion = (postion) => {
    const moveingKey =
      postion == "prev" ? spaces?.findPrev?.to : spaces?.findNext?.to;
    dispatch(
      updateCompartmentPostion({
        sectionId: selectedSectionKey,
        shelfKey: moveingKey,
        selectedKey: selected?.shelfkey,
        compartmentType: selected?.compartmentType,
        compartmentCount: selected?.compartmentCount || 1,
      })
    );
    // dispatch(
    //   setCompartmentHighlighted({
    //     shelfkey: selected?.shelfkey,
    //     compartmentType: selected?.compartmentType,
    //     count: selected?.count,
    //   })
    // );
    availbleShelve();
  };
  const btnStyle =
    "flex items-center justify-center font-inter gap-2 font-medium  rounded-[4px] border border-white  text-sm min-w-[216px] py-[5px] px-4 ";
  return (
    <div className="flex flex-col gap-2 mv_btns justify-center items-center">
      <button
        onClick={() => (spaces?.findPrev ? changePostion("prev") : "")}
        className={`${btnStyle} ${
          spaces?.findPrev
            ? "bg-red-1000 text-white"
            : "bg-light-1000 text-light-1001"
        }  `}
      >
        <svg viewBox="0 0 16 16" className={`w-4 h-4 fill-white`}>
          <path
            fillRule="evenodd"
            d="M1.636 10.364a1 1 0 001.414 1.414L8 6.828l4.95 4.95a1 1 0 101.414-1.414L8 4l-6.364 6.364z"
          ></path>
        </svg>
        Naar vorig legbord
      </button>
      <button
        onClick={() => (spaces?.findNext ? changePostion("next") : "")}
        className={`${btnStyle} ${
          spaces?.findNext
            ? "bg-red-1000 text-white"
            : "bg-light-1000 text-light-1001"
        } `}
      >
        <svg viewBox="0 0 16 16" className={`w-4 h-4 fill-white`}>
          <path
            fillRule="evenodd"
            d="M1.636 5.707A1 1 0 013.05 4.293L8 9.243l4.95-4.95a1 1 0 111.414 1.414L8 12.071 1.636 5.707z"
          ></path>
        </svg>
        Naar volgend legbord
      </button>
    </div>
  );
};

export default CompartmentsMoveButton;
