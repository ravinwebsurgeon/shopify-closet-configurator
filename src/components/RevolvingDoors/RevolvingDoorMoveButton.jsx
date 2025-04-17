/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const handlePositionChange = () => {
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
      ...Object.entries(revolvingDoorsAll).map(([key, value]) => ({
        key,
        type: value?.type,
        position: value?.position,
        height: value?.height,
      })),
      {
        position: sectionHeight / 2 - doorTypeHeight,
        key: "last",
        height: sectionHeight / 2 + doorTypeHeight,
      },
    ];
    // console.log(revolvingDoorsKeys);
    const sortedDoors = revolvingDoorsKeys.sort(
      (a, b) => a.position - b.position
    );
    const selectedIndex = sortedDoors.findIndex(
      (item) => item.key === selected?.id
    );
    // console.log(revolvingDoorsKeys);
    if (selectedIndex === -1) return;

    const selectedDoor = sortedDoors[selectedIndex];
    const selectedHeight = selectedDoor.type.includes("50") ? 25 : 50;
    const obj = {
      prev: [],
      next: [],
    };
    // revolvingDoorsKeys &&
    //   revolvingDoorsKeys
    //     .sort((a, b) => a.position - b?.position)
    //     ?.map((item) => {
    //       const position = item?.position;
    //       if ((item?.position ?? 0) < selectedDoor?.position) {
    //         obj.prev.push({
    //           type: "prev",
    //           key: item?.key,
    //           position: item?.position
    //         });
    //       }
    //       console.log(item?.position, position, selectedDoor)
    //       if (item?.position > selectedDoor?.position) {
    //         obj.next.push({
    //           type: "next",
    //           key: item?.key,
    //           fromKey
    //           position: item?.position
    //         });
    //       }
    //     });
    // const sortPrevByPosition = obj.prev.sort((a, b) => b.position - a.position);
    // const sortNextByPosition = obj.next.sort((a, b) => b.position - a.position);
    // const findPrev = obj.prev.find((item) => {
    //   return item?.space > 0;
    // });
    // const findNext = obj.next.find((item) => {
    //   return item?.space > 0;
    // });
    const spaces = revolvingDoorsKeys
      .map((item, index, arr) => {
        if (index === 0) return null;

        const fromKey = arr[index - 1];
        // console.log(fromKey)
        const doorType = fromKey && fromKey?.type?.includes("50") ? 25 : 50;
        const fromTop = arr[index - 1]?.height + doorType;
        const top = item?.height;
        // console.log(top, fromTop);
        return {
          type: "",
          from: fromKey?.key,
          to: item?.key,
          space: top - fromTop,
          shelfTop: top,
        };
      })
      .filter(Boolean);
    // console.log(spaces);
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
