import React, { useEffect, useRef, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import "./ImageConfigurator.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import DimensionsComponent from "../ConfigurationTabSubComponents/DimensionsComponent/DimensionsComponent";
import AddSection from "../ModalChildComponents/AddSectionComponent/AddSection";
import {
  deleteSection,
  setCurrSelectedSection,
  setShowCounter,
} from "../../slices/shelfDetailSlice";
import ShelfCounter from "../ConfigurationTabSubComponents/ShelvesComponent/ShelfCounter";
import SectionDimensionsIndicator from "../SectionDimensionsIndicator/SectionDimensionsIndicator";
import ShelfRemoveBtn from "../ShelfRemove/ShelfRemoveBtn";
import EditingSides from "../ConfigurationTabSubComponents/SidesComponent/EditingSides";
import BackWall from "../BackComponent/BackWall";
import EditingBack from "../BackComponent/EditingBack";
import ShelveChangePosition from "../ShelvingConfigurator/ShelveChangePosition/ShelveChangePosition";
import ShelveChangeIndicator from "../ShelvingConfigurator/ShelveChangeIndicator/ShelveChangeIndicator";
import SideAddBtn from "../SidesComp/SideAddBtn";
import SideWall from "../SideWallComponent/SideWall";

const ImageConfigurator = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.shelfDetail.racks.activeTab);
  const showCounter = useSelector(
    (state) => state.shelfDetail.racks.showCounter
  );
  const [positionArr, setPositionArr] = useState([]);
  const [racks, setRacks] = useState([]);
  const [selectedRack, setSelectedRack] = useState();
  const [prevSection, setPrevSection] = useState({
    key: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const [isShelfSelected, setIsShelfSelected] = useState({
    key: "",
    top: "0",
  });
  const [topPosition, setTopPosition] = useState(null);

  const initialShelfValue = useSelector(
    (state) => state.shelfDetail.configuration
  );

  const currentSelectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const [selectedSection, setSelectedSection] = useState(
    currentSelectedSection
  );
  const [selectedShelf, setSelectedShelf] = useState(null);

  const newInitialValue = useSelector((state) => state.shelfDetail.racks);
  const executionValues = useSelector(
    (state) => state.shelfDetail.racks.execution
  );

  const editingSides = useSelector(
    (state) => state.shelfDetail.racks.isEditingSides
  );
  const isEdtingWall = useSelector(
    (state) => state.shelfDetail.racks.isEditingBackwall
  );

  const shelfCount = initialShelfValue.shelfCount;
  const currShelfHeight = initialShelfValue.height;
  const shelfDepth = initialShelfValue.depth;
  const rackWidth = initialShelfValue.width || 55;
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const sectionKeys = Object.keys(sections);
  const heightArr = [
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
  ];

  // function used to set shelves at a specific height
  const GeneratePosArr = (currShelfHeight) => {
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

  // function used to calculate no. of racks
  const findOptimizedRacks = (totalWidth) => {
    let bestCombination = null;
    const availableWidths = [100, 130, 115, 85, 70, 55];

    const findCombination = (remaining, combination = []) => {
      if (remaining === 0) {
        if (!bestCombination || combination.length < bestCombination.length) {
          bestCombination = [...combination];
        }
        return;
      }

      for (let width of availableWidths) {
        if (remaining >= width) {
          findCombination(remaining - width, [...combination, width]);
        }
      }
    };

    findCombination(totalWidth);

    if (totalWidth === 230) return [115, 115];

    return bestCombination || [];
  };

  useEffect(() => {
    if (!currShelfHeight) return;

    const Result = heightArr.find((obj) => obj[currShelfHeight] !== undefined);

    if (!Result) {
      console.error("Invalid currShelfHeight:", currShelfHeight);
      return;
    }

    const heightResult = parseFloat(Object.values(Result)[0]);

    if (positionArr.length === 0) {
      console.warn("Position array is empty, nothing to update.");
      return;
    }
    const updatedPositions = positionArr.map((pos, index) =>
      index === positionArr.length - 1
        ? { ...pos, top: `${heightResult - 9.5}em` }
        : pos
    );

    setPositionArr(updatedPositions);
  }, [currShelfHeight]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !event.target.closest(".Legbord_Legbord__k51II") &&
        !event.target.closest(".Section_removeConfirmAccessoireButton") &&
        !event.target.closest(".mv_btns")
      ) {
        setSelectedShelf(null);
        setIsShelfSelected({
          key: "",
          top: "0",
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSectionClick = (e, sectionKey) => {
    e.preventDefault();
    setSelectedSection(sectionKey);
    dispatch(setCurrSelectedSection(sectionKey));
  };

  const handleSectionDelete = (e, sectionKey) => {
    const activeIndex = sectionKeys.indexOf(sectionKey);
    const previousSection =
      activeIndex > 0 ? sectionKeys[activeIndex - 1] : null;
    const nextSectionId =
      activeIndex < sectionKeys.length ? sectionKeys[activeIndex + 1] : null;
    const nextSection = sections[nextSectionId];
    const prevSection = sections[previousSection];
    if (prevSection && nextSection) {
      console.log(prevSection.height, nextSection.height);
      console.log("prevSection---->", prevSection);
      console.log("nextSection---->", nextSection);
      console.log(prevSection.standHeight, prevSection.height);
    }

    dispatch(deleteSection(sectionKey));
  };
  const closeShelfDeleteModal = () => {
    setIsShelfSelected({
      key: "",
      top: "0",
    });
  };
  const handleSelectedShelfClick = (
    e,
    value,
    sectionkey,
    shelfkey,
    position
  ) => {
    e.preventDefault();
    setIsShelfSelected((prev) => ({
      ...prev,
      key: shelfkey,
    }));
    setSelectedShelf(value);
    handleSectionClick(e, sectionkey);
    setTopPosition(position);
  };
  const sectionItems = Object.keys(sections);
  const maxHeight = sectionItems
    .map((item) => parseInt(sections[item].height, 10))
    .sort((a, b) => b - a)[0];
  const depth = useSelector((state) => state.shelfDetail.racks.depth);
  useEffect(() => {
    setIsShelfSelected((prev) => ({
      ...prev,
      top: topPosition,
    }));
  }, [topPosition]);

  useEffect(() => {
    const activeIndex = sectionKeys.indexOf(selectedSection);
    const previousSection =
      activeIndex > 0 ? sectionKeys[activeIndex - 1] : null;
    setPrevSection((prev) => ({ ...prev, key: previousSection }));
  }, [selectedSection]);
  return (
    <>
      <div
        ref={containerRef}
        className="visualFrame_container ConfiguratorEditView_visualFrame__5OS3U"
      >
        <div className="row-container visualFrame-top">
          <div className="spacer-div"></div>
          <div className="addsection-div flex gap-[5px]">
            {sectionKeys.map((item, index) => (
              <button
                onClick={(e) => handleSectionClick(e, item)}
                key={item}
                className={`${
                  item == selectedSection
                    ? "_selected border-[#0665C5]"
                    : "border-[rgba(0,0,0,0)]"
                } bg-[rgba(0,0,0,0.1)] border font-inter cursor-pointer font-medium text-[12px] leading-none text-black rounded-[5px] w-[30px] h-[30px] flex justify-center items-center`}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="w-[100px] h-[30px] cursor-pointer border border-[#0665C5] font-medium font-inter rounded-[5px] text-[#0665C5] text-[12px]"
              onClick={() => setIsModalOpen(true)}
            >
              {" "}
              + Add Section
            </button>
          </div>
          <div className="hidedoors-div">Hide doors</div>
        </div>
        <div className="demo-config">
          <div className="main-wrapper__ relative">
            <SectionDimensionsIndicator />
            <div className="Visual_container__tG7BQ Carousel_visual__FfW0p">
              <div
                className={`arrows-dimensionsIndicator-left relative flex items-center justify-center translate-x-[0px]   !p-0 !m-0  Section_width
          bg-[#d4d7db] w-[2px]
          `}
              >
                <span
                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#d4d7db] font-roboto`}
                >
                  {maxHeight + 2.7} cm
                </span>
              </div>
              {/* Appending racks according to data we got */}
              {newInitialValue &&
                Object.entries(newInitialValue.sections).map(
                  ([sectionKey, section], index) => (
                    <React.Fragment key={sectionKey}>
                      {/* first two poles section */}

                      <div
                        className={`Staander_Staander__rAo9j Visual_animating__a8ZaU Staander_metal
                ${executionValues.color === "black" ? "Staander_black" : ""} 
                ${
                  executionValues.topCaps === "topCaps"
                    ? "Staander_hasTopdoppen"
                    : ""
                } 
                Staander_${executionValues.feet}_Feet  
                Staander_height${section?.height || 100} ${
                          index > 0 ? "hidden" : ""
                        }`}
                        style={{ zIndex: index }}
                        key={index}
                      >
                        <div className="Staander_achter__8cpuX">
                          <div className="Staander_achterTop__nQ0aW"></div>
                          <div className="Staander_achterMiddle__XrxPJ"></div>
                          <div className="Staander_achterBottom__YRp6n"></div>
                        </div>
                        {selectedSection == sectionKey &&
                          editingSides &&
                          !sections[selectedSection].sideWall.left.isLeft && (
                            <EditingSides
                              sec={selectedSection}
                              seckey={sectionKey}
                            />
                          )}
                        {sections[sectionKey].sideWall.left.isLeft && (
                          <SideWall
                            type={sections[sectionKey].sideWall.left.type}
                            height={sections[sectionKey].sideWall.left.height}
                          />
                        )}
                        <div className="Staander_voor__AegR3">
                          <div className="Staander_voorTop__1m0QA"></div>
                          <div className="Staander_voorMiddle__O-Po9"></div>
                          <div className="Staander_voorBottom__dVzsj"></div>
                        </div>
                      </div>
                      <div>
                        {isShelfSelected?.key != "" &&
                        sectionKey == selectedSection ? (
                          <div
                            className={`shelfRemoveBtnOver shelfRemove_bottom${section?.height} shelfRemove_width${section?.width}`}
                          >
                            <ShelfRemoveBtn
                              top={isShelfSelected?.top}
                              shelfId={isShelfSelected?.key}
                              onClick={() => setSelectedShelf(null)}
                              onClose={closeShelfDeleteModal}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                        {isShelfSelected?.key != "" &&
                          sectionKey == selectedSection && (
                            <ShelveChangeIndicator
                              selectedShelfKey={isShelfSelected?.key}
                              selectedSectionKey={selectedSection}
                            />
                          )}
                      </div>
                      {/* div for edit sides or back */}
                      <div className="test">
                        {selectedSection == sectionKey && editingSides && (
                          <SideAddBtn
                            height={section?.height}
                            width={section?.width}
                          />
                        )}
                      </div>
                      {/* shelf section */}
                      <div>
                        <div
                          data-indicator-index="1"
                          className={`Section_Section__3MCIu Visual_animating__a8ZaU Section_metal__c Section_height${
                            section.height || 100
                          } Section_width${section.width || 55}`}
                          style={{ zIndex: index }}
                        >
                          {selectedSection === sectionKey &&
                            isShelfSelected?.key == "" && (
                              <div
                                className={`arrows-dimensionsIndicator-left _selected !left-[-30%] relative flex items-center justify-center translate-x-[0px]   !p-0 !m-0  Section_width
          bg-[#3c9cea] w-[2px]
          `}
                              >
                                <span
                                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-roboto`}
                                >
                                  {parseFloat(section.height) + 2.7} cm
                                </span>
                              </div>
                            )}
                          <div className="Section_accessoires__+se2+">
                            {section.shelves &&
                              Object.entries(section.shelves).map(
                                ([shelfkey, shelf]) => (
                                  <div
                                    key={shelfkey}
                                    className={`Legbord_Legbord__Outer`}
                                    style={{
                                      zIndex: shelf.position.zIndex,
                                      top: shelf.position.top,
                                    }}
                                  >
                                    <button
                                      className={`Legbord_Legbord__k51II Section_legbord__n3SHS  
                      ${
                        executionValues.color === "black"
                          ? "Legbord_black"
                          : "Legbord_metal"
                      } Legbord_clickable__uTn2b ${
                                        selectedShelf ===
                                        `${sectionKey}-${shelfkey}`
                                          ? "Legboard_isHighlighted"
                                          : ""
                                      }`}
                                      key={shelfkey}
                                      onClick={(e) =>
                                        handleSelectedShelfClick(
                                          e,
                                          `${sectionKey}-${shelfkey}`,
                                          `${sectionKey}`,
                                          `${shelfkey}`,
                                          `${shelf.position.top}`
                                        )
                                      }
                                    >
                                      <span className="ssdf"> {shelfkey}</span>
                                      <div className="Legbord_inner__eOg0b">
                                        <div className="Legbord_left__ERgV5"></div>
                                        <div className="Legbord_middle__D8U0x"></div>
                                        <div className="Legbord_right__HB8+U"></div>
                                      </div>
                                    </button>
                                  </div>
                                )
                              )}
                          </div>
                          {/* Here section header dimensions div will come */}
                          <div className="Section_sectionInterface">
                            <div className="Section_sectionNumberContainer sk_hide_on_print">
                              <button
                                className={`Section_sectionNumber font-roboto ${
                                  selectedSection === sectionKey
                                    ? "Section_sectionNumberActive"
                                    : ""
                                }`}
                                onClick={(e) =>
                                  handleSectionClick(e, sectionKey)
                                }
                              >
                                {index + 1}
                              </button>
                              {selectedSection === sectionKey &&
                                sectionKeys.length > 1 && (
                                  <button
                                    type="button"
                                    className="AddRemove_button Section_removeButton z-[1] cursor-pointer"
                                    key={sectionKey}
                                    onClick={(e) =>
                                      handleSectionDelete(e, sectionKey)
                                    }
                                  >
                                    <i
                                      className="Icon_container AddRemove_icon"
                                      style={{ width: "14px", height: "16px" }}
                                    >
                                      <svg viewBox="0 0 14 16">
                                        <path
                                          fill="currentColor"
                                          fillRule="evenodd"
                                          d="M11 6a1 1 0 01.993.883L12 7v8a1 1 0 01-.883.993L11 16H3a1 1 0 01-.993-.883L2 15V7a1 1 0 011.993-.117L4 7v7h6V7a1 1 0 01.883-.993L11 6zM7 0c.513 0 .936.483.993 1.104L8 1.25V3h5a1 1 0 010 2H1a1 1 0 110-2h5V1.25C6 .56 6.448 0 7 0z"
                                        ></path>
                                      </svg>
                                    </i>
                                  </button>
                                )}
                            </div>
                            {selectedSection == sectionKey && selectedShelf && (
                              <ShelveChangePosition
                                sectionId={selectedSection}
                                shelfKey={isShelfSelected?.key}
                              />
                            )}

                            <ShelfCounter
                              showCounter={
                                selectedSection == sectionKey &&
                                activeTab == "shelves" &&
                                showCounter
                              }
                              onClick={() => dispatch(setShowCounter(false))}
                            />
                          </div>
                        </div>
                        {selectedSection == sectionKey && isEdtingWall && (
                          <EditingBack />
                        )}
                      </div>

                      {/* next two poles */}
                      <div
                        className={`Staander_Staander__rAo9j Visual_animating__a8ZaU Staander_notFirst__FSKKl  Staander_metal  
                ${executionValues.color === "black" ? "Staander_black" : ""} 
                ${
                  executionValues.topCaps === "topCaps"
                    ? "Staander_hasTopdoppen"
                    : ""
                }  
                Staander_${executionValues.feet}_Feet 
                Staander_height${section?.standHeight || 100}`}
                        style={{ zIndex: index + 1 }}
                      >
                        <div className="Staander_achter__8cpuX">
                          <div className="Staander_achterTop__nQ0aW"></div>
                          <div className="Staander_achterMiddle__XrxPJ"></div>
                          <div className="Staander_achterBottom__YRp6n"></div>
                        </div>
                        {(selectedSection == sectionKey ||
                          prevSection.key == sectionKey) &&
                          editingSides &&
                          !sections[selectedSection].sideWall.right.isRight && (
                            <EditingSides />
                          )}
                        {sections[sectionKey].sideWall.right.isRight && (
                          <SideWall
                            type={sections[sectionKey].sideWall.right.type}
                            height={sections[sectionKey].sideWall.right.height}
                          />
                        )}
                        <div className="Staander_voor__AegR3">
                          <div className="Staander_voorTop__1m0QA"></div>
                          <div className="Staander_voorMiddle__O-Po9"></div>
                          <div className="Staander_voorBottom__dVzsj"></div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                )}
              <div
                className={`arrows-dimensionsIndicator-left arrows-dimensionsIndicator-depth _selected  relative flex items-center justify-center translate-x-[0px]  !p-0 !m-0  Section_width
          bg-[#3c9cea] w-[2px]
          `}
              >
                <span
                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-roboto`}
                >
                  {depth + 2.5} cm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalComponent isOpen={isModalOpen}>
        <AddSection onClose={() => setIsModalOpen(false)}>
          {/* <DimensionsComponent /> */}
        </AddSection>
      </ModalComponent>
    </>
  );
};

export default ImageConfigurator;
