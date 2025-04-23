/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setisRevolvingDoorHighlighted,
  updateRevolvingDoor,
} from "../../slices/shelfDetailSlice";

const RevolvingDoorMoveButton = () => {
  const dispatch = useDispatch();
  const isRevolvingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isRevolvingDoorHighlighted
  );
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
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
  }, [isRevolvingDoorHighlighted, revolvingDoorsAll]);

  // const handlePositionChange = (type) => {
  //   if (!isRevolvingDoorHighlighted || !revolvingDoorsAll) return;
  //   // console.log(isRevolvingDoorHighlighted);
  //   const doorTypeHeight = isRevolvingDoorHighlighted?.type.includes("50")
  //     ? 25
  //     : 50;
  //   const sectionHeight = sections[selectedSectionKey].height;
  //   const revolvingDoorsKeys = [
  //     {
  //       position: 0,
  //       key: "initial",
  //       height: 0,
  //     },
  //     ...(revolvingDoorsAll
  //       ? Object.entries(revolvingDoorsAll).map(([key, value]) => ({
  //           key,
  //           type: value?.type,
  //           position: value?.position,
  //           height: value?.height,
  //         }))
  //       : []),
  //     {
  //       position: sectionHeight / 2,
  //       key: "last",
  //       height: sectionHeight / 2 + (doorTypeHeight == 50 ? 25 : 25),
  //     },
  //   ];

  //   const sortedDoors = revolvingDoorsKeys.sort(
  //     (a, b) => a.position - b.position
  //   );
  //   const selectedIndex = sortedDoors.findIndex(
  //     (item) => item.key === isRevolvingDoorHighlighted?.id
  //   );
  //   if (selectedIndex === -1) return;
  //   const spaces = sortedDoors
  //     ?.map((item, index, arr) => {
  //       if (index === 0) return null;
  //       const fromKey = arr[index - 1];
  //       const fromTop = fromKey?.position + arr[index - 1]?.height;
  //       const top = item?.position;
  //       console.log(top, item?.key);
  //       return {
  //         type:
  //           fromTop <= isRevolvingDoorHighlighted?.position ? "prev" : "next",
  //         from: fromKey?.key,
  //         to: item?.key,
  //         doorType: item?.type,
  //         space: top - fromTop,
  //         shelfTop: top,
  //       };
  //     })
  //     .filter(Boolean);

  //   const filterPrev = spaces
  //     .filter((item) => item.type === "prev")
  //     .sort((a, b) => b.shelfTop - a.shelfTop);

  //   const filterNext = spaces
  //     .filter((item) => item.type === "next")
  //     .sort((a, b) => a.shelfTop - b.shelfTop);
  //   const findNext = filterNext.find(
  //     (item) => item.type === "next" && item?.space > 0
  //   );
  //   const findPrev = filterPrev.find(
  //     (item) => item.type === "prev" && item?.space > 0
  //   );
  //   const findACPrev = filterPrev.find(
  //     (item) =>
  //       item.type === "prev" && item?.to == isRevolvingDoorHighlighted?.id
  //   );
  //   const findACNext = filterNext.find(
  //     (item) =>
  //       item.type === "next" && item?.from == isRevolvingDoorHighlighted?.id
  //   );

  //   setButtons({
  //     topLeft: {
  //       active: findACPrev?.space > 0 || findPrev?.space >= doorTypeHeight,
  //     },
  //     topRight: {
  //       active: findACPrev?.space > 0 || findPrev?.space >= doorTypeHeight,
  //     },
  //     bottomLeft: {
  //       active: findACNext?.space > 0 || findNext?.space >= doorTypeHeight,
  //     },
  //     bottomRight: {
  //       active: findACNext?.space > 0 || findNext?.space >= doorTypeHeight,
  //     },
  //   });
  //   const selectedDoor = sortedDoors.find(
  //     (item) => item.key == isRevolvingDoorHighlighted?.id
  //   );
  //   const moveingDoorType = selectedDoor?.type.includes("50") ? 25 : 50;
  //   if (type) {
  //     if (type.includes("Left")) {
  //       const gap = type == "topLeft" ? 1.25 : -1.25;
  //       const newPosition = selectedDoor?.position - gap;
  //       if (
  //         newPosition >= 0 &&
  //         newPosition <= sectionHeight / 2 - moveingDoorType &&
  //         (type == "topLeft" && findACPrev ? findACPrev?.space > 0 : true) &&
  //         (type == "bottomLeft" && findACNext ? findACNext?.space > 0 : true)
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: newPosition,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: newPosition,
  //           })
  //         );
  //       }
  //       const findPrevHeight = findPrev
  //         ? findPrev?.doorType?.includes("50")
  //           ? 25
  //           : 50
  //         : 0;
  //       if (
  //         type == "topLeft" &&
  //         findPrev?.space >= findPrevHeight &&
  //         findACPrev?.space <= 0
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: findPrev?.shelfTop - findPrevHeight,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: findPrev?.shelfTop - findPrevHeight,
  //           })
  //         );
  //       }
  //       const findNextHeight = isRevolvingDoorHighlighted
  //         ? isRevolvingDoorHighlighted?.type?.includes("50")
  //           ? 25
  //           : isRevolvingDoorHighlighted?.type?.includes("100")
  //           ? 50
  //           : 0
  //         : 0;
  //       if (
  //         type == "bottomLeft" &&
  //         findNext?.space >= findNextHeight &&
  //         findACNext?.space <= 0
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: findNext?.shelfTop - findNextHeight,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: findNext?.shelfTop - findNextHeight,
  //           })
  //         );
  //       }
  //     }
  //     if (type.includes("Right")) {
  //       const gap = type == "bottomRight" ? -5 : 5;
  //       let newPosition = selectedDoor?.position - gap;
  //       if (type == "topRight" && findACPrev && findACPrev?.space <= 6.25) {
  //         newPosition = newPosition - (findACPrev?.space - gap);
  //       }
  //       if (type == "bottomRight" && findACNext && findACNext?.space <= 6.25) {
  //         newPosition = newPosition + (findACNext?.space + gap);
  //       }
  //       if (
  //         newPosition >= 0 &&
  //         newPosition <= sectionHeight / 2 - moveingDoorType &&
  //         (type == "topRight" && findACPrev ? findACPrev?.space >= 0 : true) &&
  //         (type == "bottomRight" && findACNext ? findACNext?.space >= 0 : true)
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: newPosition,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: newPosition,
  //           })
  //         );
  //       }
  //       const findPrevHeight = findPrev
  //         ? findPrev?.doorType?.includes("50")
  //           ? 25
  //           : 50
  //         : 0;
  //       if (
  //         type == "topRight" &&
  //         findPrev?.space >= findPrevHeight &&
  //         findACPrev?.space <= 0
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: findPrev?.shelfTop - findPrevHeight,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: findPrev?.shelfTop - findPrevHeight,
  //           })
  //         );
  //       }
  //       const findNextHeight = isRevolvingDoorHighlighted
  //         ? isRevolvingDoorHighlighted?.type?.includes("50")
  //           ? 25
  //           : isRevolvingDoorHighlighted?.type?.includes("100")
  //           ? 50
  //           : 0
  //         : 0;
  //       if (
  //         type == "bottomRight" &&
  //         findNext?.space >= findNextHeight &&
  //         findACNext?.space <= 0
  //       ) {
  //         dispatch(
  //           updateRevolvingDoor({
  //             sectionId: selectedSectionKey,
  //             doorKey: isRevolvingDoorHighlighted?.id,
  //             position: findNext?.shelfTop - findNextHeight,
  //           })
  //         );
  //         dispatch(
  //           setisRevolvingDoorHighlighted({
  //             id: isRevolvingDoorHighlighted?.id,
  //             type: isRevolvingDoorHighlighted?.type,
  //             position: findNext?.shelfTop - findNextHeight,
  //           })
  //         );
  //       }
  //     }
  //   }
  //   // console.log("findPrev", findPrev);
  //   // console.log("findNext", findNext);
  //   // console.log("filterNext", filterNext);
  //   // console.log("filterPrev", filterPrev);
  // };

  const { filteredShelfs, filteredDoors } = useMemo(() => {
    if (!sections || !selectedSectionKey)
      return { filteredShelfs: [], filteredDoors: [] };

    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      type: value?.type || null,
      position:
        key?.includes("slidingDoors") || key?.includes("revolvingDoors_")
          ? value?.position
          : parseFloat(value?.position?.top || 0),
    }));

    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("drawer_") && !item?.key.includes("compartment")
    );

    const filteredDoors = shelfs
      .filter(
        (item) =>
          !item?.key.includes("drawer_") &&
          !item?.key.includes("compartment") &&
          !item?.key.includes("shelve")
      )
      .sort((a, b) => a.position - b.position);

    return { filteredShelfs, filteredDoors };
  }, [sections, selectedSectionKey]);
  const calculateDoorSpacing = (id, doorHeight) => {
    if (!section) return null;

    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const h =
          fromKey && fromKey?.key.includes("slidingDoors")
            ? 22.5
            : fromKey && fromKey?.key.includes("revolvingDoors_")
            ? doorHeight
            : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isRevolvingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          comType: item?.type,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);

    const revolvingDoorsKeys = [
      {
        position: 0,
        key: "initial",
        height: 0,
      },
      ...(filteredDoors || []),
      {
        position: section.height / 2,
        key: "last",
        height: section.height / 2 + (doorHeight === 50 ? 25 : 25),
      },
    ];

    const spaceBetweenDoors = revolvingDoorsKeys
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
            item?.position <= isRevolvingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          comType: item?.type,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.fromPosition - b.fromPosition)
      .filter((item) => item?.space > 0)
      .sort((a, b) => b.toPosition - a.toPosition);

    return {
      spaceBetweenShelves,
      spaceBetweenDoors,
    };
  };
  const handlePositionChange = (type) => {
    const doorTypeHeight = isRevolvingDoorHighlighted?.type.includes("50")
      ? 25
      : 50;
    const { spaceBetweenDoors } = calculateDoorSpacing(
      isRevolvingDoorHighlighted?.id,
      isRevolvingDoorHighlighted?.height
    );
    const filterPrev = spaceBetweenDoors
      .filter((item) => item.type === "prev")
      .sort((a, b) => b.toPosition - a.toPosition);
    // console.log(spaceBetweenDoors);
    const filterNext = spaceBetweenDoors
      .filter((item) => item.type === "next")
      .sort((a, b) => a.toPosition - b.toPosition);
    const findNext = filterNext.find(
      (item) => item.type === "next" && item?.space > 0
    );
    const findPrev = filterPrev.find(
      (item) => item.type === "prev" && item?.space > 0
    );
    const findACPrev = filterPrev.find(
      (item) =>
        item.type === "prev" && item?.to == isRevolvingDoorHighlighted?.id
    );
    const findACNext = filterNext.find(
      (item) =>
        item.type === "next" && item?.from == isRevolvingDoorHighlighted?.id
    );
    setButtons({
      topLeft: {
        active: findACPrev?.space > 0 || findPrev?.space >= doorTypeHeight,
      },
      topRight: {
        active: findACPrev?.space > 0 || findPrev?.space >= doorTypeHeight,
      },
      bottomLeft: {
        active: findACNext?.space > 0 || findNext?.space >= doorTypeHeight,
      },
      bottomRight: {
        active: findACNext?.space > 0 || findNext?.space >= doorTypeHeight,
      },
    });
    if (type) {
      if (type.includes("Left")) {
        const gap = type == "topLeft" ? 1.25 : -1.25;
        let newPosition = isRevolvingDoorHighlighted?.position - gap;
        if (
          !findACPrev &&
          type == "topLeft" &&
          findPrev?.space >= isRevolvingDoorHighlighted?.height
        ) {
          newPosition =
            findPrev?.toPosition - isRevolvingDoorHighlighted?.height;
        }
        if (
          !findACNext &&
          type == "bottomLeft" &&
          findNext?.space >= isRevolvingDoorHighlighted?.height
        ) {
          newPosition =
            findNext?.fromPosition + isRevolvingDoorHighlighted?.height;
        }

        if (
          newPosition >= 0 &&
          newPosition <= section.height / 2 - isRevolvingDoorHighlighted?.height
        ) {
          dispatch(
            updateRevolvingDoor({
              sectionId: selectedSectionKey,
              doorKey: isRevolvingDoorHighlighted?.id,
              position: newPosition,
            })
          );
          dispatch(
            setisRevolvingDoorHighlighted({
              id: isRevolvingDoorHighlighted?.id,
              position: newPosition,
              type: isRevolvingDoorHighlighted?.type,
              height: isRevolvingDoorHighlighted?.height,
            })
          );
        }
      }
      if (type.includes("Right")) {
        const gap = type == "topRight" ? 5 : -5;
        let newPosition = isRevolvingDoorHighlighted?.position - gap;
        if (
          !findACPrev &&
          type == "topRight" &&
          findPrev?.space >= isRevolvingDoorHighlighted?.height
        ) {
          newPosition =
            findPrev?.toPosition - isRevolvingDoorHighlighted?.height;
        }
        console.log(findNext);
        if (
          !findACNext &&
          type == "bottomRight" &&
          findNext?.space >= isRevolvingDoorHighlighted?.height
        ) {
          newPosition =
            findNext?.toPosition - isRevolvingDoorHighlighted?.height;
        }
        if (findACPrev?.space < 5 && type == "topRight") {
          newPosition =
            findACPrev?.fromPosition +
            (findACPrev?.comType.includes("50") ? 25 : 50);
        }
        if (
          newPosition >= 0 &&
          newPosition <= section.height / 2 - isRevolvingDoorHighlighted?.height
        ) {
          dispatch(
            updateRevolvingDoor({
              sectionId: selectedSectionKey,
              doorKey: isRevolvingDoorHighlighted?.id,
              position: newPosition,
            })
          );
          dispatch(
            setisRevolvingDoorHighlighted({
              id: isRevolvingDoorHighlighted?.id,
              position: newPosition,
              type: isRevolvingDoorHighlighted?.type,
              height: isRevolvingDoorHighlighted?.height,
            })
          );
        }
      }
    }
    // console.log("findACNext", findACNext);
    // console.log("findPrev", findPrev);
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

export default RevolvingDoorMoveButton;
