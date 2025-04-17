/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRevolvingDoor } from "../../slices/shelfDetailSlice";

const RevolvingDoorMoveButton = ({ selected }) => {
  const dispatch = useDispatch();

  const sections = useSelector((state) => state.shelfDetail.racks.sections);

  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const revolvingDoorsAll = useSelector(
    (state) =>
      state.shelfDetail.racks.sections[selectedSectionKey].revolvingDoor
  );
  const [buttons, setButtons] = useState({
    topLeft: { active: false },
    topRight: { active: false },
    bottomLeft: { active: false },
    bottomRight: { active: false },
  });
  useEffect(() => {
    handlePositionChange();
  }, [selected]);
  const handlePositionChange = (type) => {
    if (!selected || !revolvingDoorsAll) return;
    // console.log(selected);
    const doorTypeHeight = selected?.type.includes("50") ? 25 : 50;
    const sectionHeight = sections[selectedSectionKey].height;
    const revolvingDoorsKeys = [
      {
        position: 0,
        key: "initial",
        height: 0,
      },
      ...(revolvingDoorsAll
        ? Object.entries(revolvingDoorsAll).map(([key, value]) => ({
            key,
            type: value?.type,
            position: value?.position,
            height: value?.height,
          }))
        : []),
      {
        position: sectionHeight / 2,
        key: "last",
        height: sectionHeight / 2 + (doorTypeHeight == 50 ? 25 : 25),
      },
    ];

    const sortedDoors = revolvingDoorsKeys.sort(
      (a, b) => a.position - b.position
    );
    const selectedIndex = sortedDoors.findIndex(
      (item) => item.key === selected?.id
    );
    if (selectedIndex === -1) return;
    const spaces = sortedDoors
      ?.map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const fromTop = fromKey?.position + arr[index - 1]?.height;
        const top = item?.position;

        return {
          type: top <= selected?.position ? "prev" : "next",
          from: fromKey?.key,
          to: item?.key,
          space: top - fromTop,
          shelfTop: top,
        };
      })
      .filter(Boolean);
    const filterPrev = spaces
      .filter((item) => item.type === "prev")
      .sort((a, b) => b.shelfTop - a.shelfTop);
    const filterNext = spaces.filter((item) => item.type === "next");
    const findPrev = spaces.find(
      (item) => item.type === "prev" && item?.space > 1
    );

    const findNext = spaces.find(
      (item) => item.type === "next" && item?.space > 1
    );
    setButtons({
      topLeft: { active: findPrev?.space > 0 },
      topRight: { active: findPrev?.space > 0 },
      bottomLeft: { active: findNext?.space > 0 },
      bottomRight: { active: findNext?.space > 0 },
    });
    const selectedDoor = sortedDoors.find((item) => item.key == selected?.id);

    if (type) {
      if (type.includes("Left")) {
        const gap = type == "topLeft" ? 1.25 : -1.25;
        const newPosition = selectedDoor?.position - gap;
        console.log(newPosition);
        dispatch(
          updateRevolvingDoor({
            sectionId: selectedSectionKey,
            doorKey: selected?.id,
            position: newPosition,
          })
        );
      }
      if (type.includes("Right")) {
        const gap = type == "bottomRight" ? -5 : 5;
        const newPosition = selectedDoor?.position - gap;
        console.log(newPosition);
        dispatch(
          updateRevolvingDoor({
            sectionId: selectedSectionKey,
            doorKey: selected?.id,
            position: newPosition,
          })
        );
      }
    }
    console.log(findPrev, findNext, filterNext, filterPrev);
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

export default RevolvingDoorMoveButton;
