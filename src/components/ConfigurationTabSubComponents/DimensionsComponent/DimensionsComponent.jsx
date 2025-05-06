import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteShelf,
  removeDrawersFromSection,
  removeRevolvingDoor,
  removeSectionDoors,
  setConfiguration,
  updateBackwall,
  updateLastShelvePostion,
  updateSectionDimensions,
  updateSideWall,
} from "../../../slices/shelfDetailSlice";
import "./DimensionsComponent.css";
import { shelfCountsAccHeight } from "../../../assets/data/ConfigratorData";
import {
  updateLastWoodShelvePostion,
  updateWoodSectionDimensions,
} from "../../../slices/WoodShelfDetailSlice";
import SliderShelfCounter from "../ShelvesComponent/SliderShelfCounter";
import { combineSlices } from "@reduxjs/toolkit";

const DimensionsComponent = () => {
  const dispatch = useDispatch();
  const configuration = useSelector((state) => state.shelfDetail.configuration);
  const material = useSelector(
    (state) => state.shelfDetail.racks.execution?.material
  );
  const metalRacks = useSelector((state) => state.shelfDetail.racks);
  const woodRacks = useSelector((state) => state.woodShelfDetail.racks);
  const sections =
    material == "metal" ? metalRacks?.sections : woodRacks?.sections;
  const activeSectionId =
    material == "metal"
      ? metalRacks?.selectedSection
      : woodRacks?.selectedSection;
  const activeSection = sections[activeSectionId];
  const depth = material == "metal" ? metalRacks.depth : woodRacks.depth;
  const revDoor = activeSection.revolvingDoor;

  // Predefined values for each dimension
  const dimensionOptions = {
    width:
      material == "metal" ? [55, 70, 85, 100, 115, 130] : [60, 75, 100, 120],
    height:
      material == "metal"
        ? [100, 120, 150, 200, 220, 250, 300, 350]
        : [90, 150, 180, 210, 240, 300],
    depth:
      material == "metal"
        ? [20, 30, 40, 50, 60, 70, 80, 100]
        : [30, 40, 50, 60],
  };

  const [dimensions, setDimensions] = useState({
    width: activeSection?.width || dimensionOptions.width[0],
    height: activeSection?.height || dimensionOptions.height[0],
    depth: depth || dimensionOptions.depth[0],
  });

  useEffect(() => {
    if (activeSection) {
      setDimensions({
        width: activeSection.width || dimensionOptions.width[0],
        height: activeSection.height || dimensionOptions.height[0],
        depth: depth || dimensionOptions.depth[0],
      });
    }
  }, [activeSectionId, activeSection]);

  const heightArr = [
    { 90: "52" },
    { 100: "57" },
    { 120: "67" },
    { 150: "82" },
    { 180: "97" },
    { 200: "107" },
    { 210: "112" },
    { 220: "117" },
    { 240: "127" },
    { 250: "132" },
    { 300: "157" },
    { 350: "182" },
  ];

  const GeneratePosArr = (currShelfHeight, shelfCount) => {
    const Result = heightArr.find((obj) => obj[currShelfHeight] !== undefined);
    const heightResult = parseInt(Object.values(Result)[0]);

    const positions = [];

    for (let i = 0; i < shelfCount; i++) {
      const topPosition = ((heightResult - 9.5) / (shelfCount - 1)) * i;
      positions.push({
        zIndex: shelfCount - i,
        top: `${topPosition}em`,
      });
    }
    return positions;
  };

  const shelves = activeSection?.shelves;
  const shelvesKeys = Object.keys(shelves) || [];

  const handleDimensionChange = (dimension, value) => {
    const isLeftSidewall = sections[activeSectionId].sideWall["left"].isLeft;
    const isRightSidewall = sections[activeSectionId].sideWall["right"].isRight;
    const isBackwall = sections[activeSectionId].backWall.type;
    const backWall = sections[activeSectionId].backWall;

    // checking if active section is having left ,right
    if (isLeftSidewall || isRightSidewall) {
      //checking weather there are multiple sections
      const numOfSections = Object.keys(sections).length;

      if (numOfSections > 1 && isRightSidewall) {
        // check if selected section is section_1
        if (activeSectionId == "section_1" && dimension == "height") {
          if (sections[activeSectionId].sideWall["left"].height > value) {
            const leftSide = sections[activeSectionId].sideWall["left"];
            dispatch(
              updateSideWall({
                sectionId: activeSectionId,
                side: "left",
                ...leftSide,
                height: value,
              })
            );
          }
        } else {
          if (dimension === "height") {
            const leftWall = sections[activeSectionId].sideWall["left"];
            const rightWall = sections[activeSectionId].sideWall["right"];
            if (isLeftSidewall && isRightSidewall) {
              if (leftWall.height > value && rightWall.height > value) {
                dispatch(
                  updateSideWall({
                    sectionId: activeSectionId,
                    side: "left",
                    ...leftWall,
                    height: value,
                  })
                );
                dispatch(
                  updateSideWall({
                    sectionId: activeSectionId,
                    side: "right",
                    ...rightWall,
                    height: value,
                  })
                );
              }
            } else if (isLeftSidewall && leftWall.height > value) {
              dispatch(
                updateSideWall({
                  sectionId: activeSectionId,
                  side: "left",
                  ...leftWall,
                  height: value,
                })
              );
            } else if (isRightSidewall && rightWall.height > value) {
              dispatch(
                updateSideWall({
                  sectionId: activeSectionId,
                  side: "right",
                  ...rightWall,
                  height: value,
                })
              );
            }
          }
        }
      } else {
        if (dimension === "height") {
          const leftWall = sections[activeSectionId].sideWall["left"];
          const rightWall = sections[activeSectionId].sideWall["right"];
          if (isLeftSidewall && isRightSidewall) {
            if (leftWall.height > value && rightWall.height > value) {
              dispatch(
                updateSideWall({
                  sectionId: activeSectionId,
                  side: "left",
                  ...leftWall,
                  height: value,
                })
              );
              dispatch(
                updateSideWall({
                  sectionId: activeSectionId,
                  side: "right",
                  ...rightWall,
                  height: value,
                })
              );
            }
          } else if (isLeftSidewall && leftWall.height > value) {
            dispatch(
              updateSideWall({
                sectionId: activeSectionId,
                side: "left",
                ...leftWall,
                height: value,
              })
            );
          } else if (isRightSidewall && rightWall.height > value) {
            dispatch(
              updateSideWall({
                sectionId: activeSectionId,
                side: "right",
                ...rightWall,
                height: value,
              })
            );
          }
        }
      }
    }

    if (
      isBackwall &&
      dimension == "height" &&
      backWall.height > value &&
      material == "metal"
    ) {
      dispatch(
        updateBackwall({
          sectionId: activeSectionId,
          type: sections[activeSectionId].backWall.type,
          height: value,
        })
      );
    }
    //  delete the section back wall when width > 100
    if (
      isBackwall &&
      dimension == "width" &&
      value > 100 &&
      material == "metal"
    ) {
      dispatch(
        updateBackwall({
          sectionId: activeSectionId,
          type: "",
          height: "",
        })
      );
    }

    // delete revolving door from the selected section when width > 100
    if (
      dimension == "width" &&
      value > 100 &&
      revDoor &&
      Object.keys(revDoor).length > 0 &&
      material == "metal"
    ) {
      dispatch(removeSectionDoors({ sectionId: activeSectionId }));
    }
    // delete revolving door according to the height change (if doors exixts)
    if (
      dimension === "height" &&
      revDoor &&
      Object.keys(revDoor).length > 0 &&
      material == "metal"
    ) {
      const oldHeight = activeSection.height;
      const newHeight = value;
      let usedHeight = 0;
      let space = 0;

      const doorList = Object.entries(revDoor).map(([key, door]) => {
        const height = parseInt(door.type.split("_")[3]);
        usedHeight += height;
        return { key, ...door, height };
      });

      if (oldHeight > usedHeight) {
        space = oldHeight - usedHeight;
      }

      const sortedByPosition = doorList.sort((a, b) => b.position - a.position);
      let currentHeight = usedHeight;

      for (let i = 0; i < sortedByPosition.length; i++) {
        const door = sortedByPosition[i];

        const isOverflowing = door.position + door.height > newHeight / 2;

        if (isOverflowing || currentHeight > newHeight) {
          dispatch(
            removeRevolvingDoor({
              sectionId: activeSectionId,
              doorKey: door.key,
            })
          );

          currentHeight -= door.height;

          if (currentHeight <= newHeight) break;
        }
      }
    }

    // delete drawers from section when width > 100
    if (
      (dimension == "width" && value > 100) ||
      (dimension == "depth" &&
        (value < 40 || value > 50) &&
        material == "metal")
    ) {
      let currSection = activeSectionId;
      let shelvesObject = activeSection.shelves;

      const hasDrawers = Object.keys(shelvesObject).some((key) =>
        key.includes("drawer")
      );

      if (hasDrawers) {
        dispatch(removeDrawersFromSection({ sectionId: currSection }));
      }
    }

    const newValue = parseInt(value);
    const newDimensions = { ...dimensions, [dimension]: newValue };
    setDimensions(newDimensions);

    if (activeSectionId && sections) {
      const updatedSection = sections[activeSectionId];
      let positions = null;

      if (dimension === "height" && updatedSection.shelves) {
        const sectionKeys = Object.keys(sections).sort((a, b) => {
          return parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]);
        });
        const activeIndex = sectionKeys.indexOf(activeSectionId);

        const previousSection =
          activeIndex > 0 ? sectionKeys[activeIndex - 1] : null;
        const nextSectionId =
          activeIndex < sectionKeys.length
            ? sectionKeys[activeIndex + 1]
            : null;
        const nextSection = sections[nextSectionId];
        const prevSection = sections[previousSection];
       const shelfCount = Object.keys(updatedSection.shelves).length;
       //const shelfCount  = getShelfCount(updatedSection.shelves)
        positions = GeneratePosArr(newValue, shelfCount);

        if (prevSection) {
          if (prevSection.height <= newValue) {
            if (material == "metal") {
              dispatch(
                updateSectionDimensions({
                  sectionId: previousSection,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            } else {
              dispatch(
                updateWoodSectionDimensions({
                  sectionId: previousSection,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            }
          }
        }
        if (updatedSection) {
          if (nextSection && nextSection.height <= newValue) {
            if (material == "metal") {
              dispatch(
                updateSectionDimensions({
                  sectionId: activeSectionId,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            } else {
              dispatch(
                updateWoodSectionDimensions({
                  sectionId: activeSectionId,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            }
          }
          if (!nextSection) {
            if (material == "metal") {
              dispatch(
                updateSectionDimensions({
                  sectionId: activeSectionId,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            } else {
              dispatch(
                updateWoodSectionDimensions({
                  sectionId: activeSectionId,
                  dimension: "standHeight",
                  value: newValue,
                  positions,
                })
              );
            }
          }
        }
      }

      dispatch(
        updateSectionDimensions({
          sectionId: activeSectionId,
          dimension,
          value: newValue,
        })
      );
      dispatch(
        updateLastShelvePostion({
          sectionId: activeSectionId,
          positions,
          dimension,
          value: newValue,
        })
      );
      if (dimension == "height") {
        const items = [];
        shelvesKeys.map((item) => {
          const top = parseFloat(
            shelves[item]?.drawer?.position?.top ||
              shelves[item]?.compartments?.position?.top ||
              shelves[item]?.position?.top
          );
          items.push({
            key: item,
            top: top,
          });
        });
        items.map((item, index) => {
          if (index === items?.length - 1) return null;
          if (index === items?.length - 2 && item.key.includes("compartment"))
            return null;
          const maxTop = parseFloat(shelfCountsAccHeight[value]?.maxTop);
          if (item?.top > maxTop && items?.length >= 3) {
            dispatch(
              deleteShelf({ sectionId: activeSectionId, shelfId: item?.key })
            );
          }
        });
      }
    }
  };

  const calculateSliderStyle = (value, options) => {
    const index = options.indexOf(Number(value));
    const percentage = (index / (options.length - 1)) * 100;
    return { "--value-percent": `${percentage}%` };
  };

  return (
    <>
      <div className="dimensions-content flex flex-col gap-[33px]">
        <div className="dimension-row">
          <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
            Hoogte
            <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
              {dimensions.height} cm
            </span>
          </label>
          <div className="dimension-control">
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={dimensionOptions.height.length - 1}
                value={dimensionOptions.height.indexOf(
                  Number(dimensions.height)
                )}
                className="dimension-slider"
                style={calculateSliderStyle(
                  dimensions.height,
                  dimensionOptions.height
                )}
                onChange={(e) =>
                  handleDimensionChange(
                    "height",
                    dimensionOptions.height[e.target.value]
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="dimension-row">
          <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
            Breedte
            <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
              {dimensions.width} cm
            </span>
          </label>
          <div className="dimension-control">
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={dimensionOptions.width.length - 1}
                value={dimensionOptions.width.indexOf(dimensions.width)}
                className="dimension-slider"
                style={calculateSliderStyle(
                  dimensions.width,
                  dimensionOptions.width
                )}
                onChange={(e) =>
                  handleDimensionChange(
                    "width",
                    dimensionOptions.width[e.target.value]
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="dimension-row">
          <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
            Diepte
            <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
              {dimensions.depth} cm
            </span>
          </label>
          <div className="dimension-control">
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max={dimensionOptions.depth.length - 1}
                value={dimensionOptions.depth.indexOf(Number(dimensions.depth))}
                className="dimension-slider"
                style={calculateSliderStyle(
                  dimensions.depth,
                  dimensionOptions.depth
                )}
                onChange={(e) =>
                  handleDimensionChange(
                    "depth",
                    dimensionOptions.depth[e.target.value]
                  )
                }
              />
            </div>
          </div>
        </div>
        <SliderShelfCounter />
      </div>
    </>
  );
};

export default DimensionsComponent;
