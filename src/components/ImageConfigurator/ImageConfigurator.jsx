import React, { useEffect, useRef, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import "./ImageConfigurator.css";
import AddSection from "../ModalChildComponents/AddSectionComponent/AddSection";
import {
  deleteSection,
  setCompartmentHighlighted,
  setCurrSelectedSection,
  setEditingBackwall,
  setEditingSides,
  setShowCounter,
  updateSideWall,
} from "../../slices/shelfDetailSlice";
import ShelfCounter from "../ConfigurationTabSubComponents/ShelvesComponent/ShelfCounter";
import SectionDimensionsIndicator from "../SectionDimensionsIndicator/SectionDimensionsIndicator";
import EditingSides from "../ConfigurationTabSubComponents/SidesComponent/EditingSides";

import ShelveChangePosition from "../ShelvingConfigurator/ShelveChangePosition/ShelveChangePosition";
import SideAddBtn from "../SidesComp/SideAddBtn";
import SideWall from "../SideWallComponent/SideWall";
import BackAddBtn from "../BackAddBtn/BackAddBtn";

import XBrace from "../XBraceComponent/XBrace";
import EditingBack from "../ConfigurationTabSubComponents/BackwallComponent/EditingBack";
import BackWall from "../BackComponent/BackWall";
import CompartmentsButton from "../Compartments/CompartmentsButton";
import SidePoll from "../Shared/SidePoll/SidePoll";
import Modal from "../Shared/Modal/Modal";

const ImageConfigurator = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.shelfDetail.racks.activeTab);
  const showCounter = useSelector(
    (state) => state.shelfDetail.racks.showCounter
  );
  const [positionArr, setPositionArr] = useState([]);
  const [backWallSelectedSection, setBackWallSelectedSection] = useState("");

  // const[scale,setScale] = useState(0.9);

  const [prevSection, setPrevSection] = useState({
    key: "",
  });

  const [isHighlighted, setisHighlighted] = useState({
    left: "",
    right: "",
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

  const handleSidewallLeftBtnClick = (e, sectionkey) => {
    e.preventDefault();
    setisHighlighted((prev) => ({
      ...prev,
      left: sectionkey,
      right: "",
    }));
    dispatch(setEditingSides(true));
    dispatch(setCurrSelectedSection(sectionkey));
    setSelectedSection(sectionkey);
  };

  const handleSidewallRightBtnClick = (e, sectionkey) => {
    e.preventDefault();
    setisHighlighted((prev) => ({
      ...prev,
      right: sectionkey,
      left: "",
    }));
    dispatch(setEditingSides(true));
  };

  const getMaxHeight = () => {
    const result = Object.values(sections).some(
      (section) => section.height > 220
    );
    return result;
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
        !event.target.closest(".mv_btns") &&
        !event.target.closest(".AddRemove_button") &&
        !event.target.closest(".modal-content") &&
        !event.target.closest(".glb-remove-confirm")
      ) {
        setSelectedShelf(null);
        setIsShelfSelected({
          key: "",
          top: "0",
        });
        dispatch(setEditingSides(false));
        setisHighlighted({
          left: "",
          right: "",
        });
        dispatch(setEditingBackwall(false));
        setBackWallSelectedSection("");
        dispatch(setCompartmentHighlighted(""));
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
    const selectedSection = sections[sectionKey];
    const nextSection = nextSectionId ? sections[nextSectionId] : null;

    if (
      selectedSection?.sideWall?.right &&
      selectedSection.sideWall.right.isRight &&
      nextSection
    ) {
      const rightSideWall = selectedSection.sideWall.right;
      dispatch(
        updateSideWall({
          sectionId: nextSectionId,
          side: "left",
          ...rightSideWall,
        })
      );
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
              className="w-[100px] h-[30px] ml-[15px] cursor-pointer border border-[#0665C5] flex items-center justify-center font-medium font-inter rounded-[5px] text-[#0665C5] text-[10px]"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="font-inter font-light text-[30px] leading-none tracking-normal text-[#0665C5] mt-[-5px]">
                +
              </span>{" "}
              Add Section
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
                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#d4d7db] font-inter`}
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
                            highlighted={isHighlighted.left === sectionKey}
                          />
                        )}
                        {sections[sectionKey].sideWall.left.isLeft && (
                          <SideWall
                            type={sections[sectionKey].sideWall.left.type}
                            height={sections[sectionKey].sideWall.left.height}
                            highlighted={isHighlighted.left === sectionKey}
                          />
                        )}
                        <div className="Staander_voor__AegR3">
                          <div className="Staander_voorTop__1m0QA"></div>
                          <div className="Staander_voorMiddle__O-Po9"></div>
                          <div className="Staander_voorBottom__dVzsj"></div>
                        </div>
                      </div>
                      <SidePoll
                        closeShelfDeleteModal={closeShelfDeleteModal}
                        isShelfSelected={isShelfSelected}
                        section={section}
                        sectionKey={sectionKey}
                        selectedSection={selectedSection}
                        setSelectedShelf={setSelectedShelf}
                      />

                      {/* div for edit sides or back */}
                      <div className="test">
                        {selectedSection == sectionKey && editingSides && (
                          <SideAddBtn
                            setisHighlighted={setisHighlighted}
                            height={section?.height}
                            width={section?.width}
                            sideType="left"
                          />
                        )}

                        {selectedSection == sectionKey && isEdtingWall && (
                          <BackAddBtn
                            height={section?.height}
                            width={section?.width}
                            type={sections[sectionKey].backWall.type}
                            id={sectionKey}
                          />
                        )}
                      </div>
                      {sections[sectionKey].sideWall.left.isLeft && (
                        <button
                          className="stander-side-wall-btn"
                          onClick={(e) =>
                            handleSidewallLeftBtnClick(e, sectionKey)
                          }
                        ></button>
                      )}
                      {/* shelf section */}
                      <div>
                        <div
                          data-indicator-index={index + 1}
                          className={`Section_Section__3MCIu Visual_animating__a8ZaU Section_metal__c
                            ${
                              executionValues.color === "black"
                                ? "Section_black"
                                : ""
                            } 
                            Section_height${
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
                                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-inter`}
                                >
                                  {parseFloat(section.height) + 2.7} cm
                                </span>
                              </div>
                            )}
                          <div className="Section_accessoires__+se2+">
                            {section.shelves &&
                              Object.entries(section.shelves).map(
                                ([shelfkey, shelf]) => (
                                  <React.Fragment key={shelfkey}>
                                    {shelf?.compartments && (
                                      <div
                                        className={`Legbord_Legbord__Outer !absolute w-full`}
                                        style={{
                                          zIndex: shelf.position.zIndex + 1,
                                          top: shelf.position.top,
                                        }}
                                      >
                                        <CompartmentsButton
                                          shelfkey={shelfkey}
                                          compartments={shelf?.compartments}
                                        />
                                      </div>
                                    )}
                                    <div
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
                                        <div className="Legbord_inner__eOg0b">
                                          <div className="Legbord_left__ERgV5"></div>
                                          <div className="Legbord_middle__D8U0x"></div>
                                          <div className="Legbord_right__HB8+U"></div>
                                        </div>
                                      </button>
                                    </div>
                                  </React.Fragment>
                                )
                              )}
                          </div>
                          {/* Here section header dimensions div will come */}
                          <div className="Section_sectionInterface">
                            <div className="Section_sectionNumberContainer sk_hide_on_print">
                              <button
                                className={`Section_sectionNumber font-inter ${
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
                          {selectedSection === sectionKey &&
                            isEdtingWall &&
                            !sections[sectionKey].backWall.type && (
                              <EditingBack />
                            )}
                          {(getMaxHeight() ||
                            (parseInt(sectionKey.split("_")[1], 10) % 2 !== 0 &&
                              sections[sectionKey].height > 100)) &&
                            executionValues.braces == "X-braces" && <XBrace />}
                          {Number(section?.width) < 115 && (
                            <BackWall
                              type={sections[sectionKey].backWall.type}
                              height={sections[sectionKey].backWall.height}
                              id={sectionKey}
                              selectedSectionBackWall={backWallSelectedSection}
                              selectedSection={selectedSection}
                              setBackWallSelectedSection={
                                setBackWallSelectedSection
                              }
                              setSelectedSection={setSelectedSection}
                            />
                          )}
                        </div>
                      </div>
                      <div className="">
                        {selectedSection == sectionKey && editingSides && (
                          <SideAddBtn
                            setisHighlighted={setisHighlighted}
                            prevKey={prevSection?.key}
                            height={section?.height}
                            width={section?.width}
                            sideType="right"
                          />
                        )}
                      </div>

                      {sections[sectionKey].sideWall.right.isRight && (
                        <button
                          className="stander-side-wall-btn"
                          onClick={(e) =>
                            handleSidewallRightBtnClick(
                              e,
                              sectionKey != selectedSection
                                ? prevSection?.key
                                : sectionKey
                            )
                          }
                        ></button>
                      )}
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
                Staander_height${section?.standHeight || 100}
                
                `}
                        style={{ zIndex: index + 1 }}
                      >
                        {sections[sectionKey].sideWall.right.isRight && (
                          <SideWall
                            type={sections[sectionKey].sideWall.right.type}
                            height={sections[sectionKey].sideWall.right.height}
                            highlighted={isHighlighted.right === sectionKey}
                          />
                        )}
                        <div className="Staander_achter__8cpuX">
                          <div className="Staander_achterTop__nQ0aW"></div>
                          <div className="Staander_achterMiddle__XrxPJ"></div>
                          <div className="Staander_achterBottom__YRp6n"></div>
                        </div>
                        {prevSection.key == sectionKey &&
                          editingSides &&
                          !sections[selectedSection].sideWall.right.isRight &&
                          !(
                            prevSection?.key &&
                            sections[prevSection.key]?.sideWall.right.isRight
                          ) && <EditingSides />}
                        {selectedSection == sectionKey &&
                          editingSides &&
                          !sections[selectedSection].sideWall.right.isRight && (
                            <EditingSides />
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
                  className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-inter`}
                >
                  {depth + 2.5} cm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          mainHeading={"Nieuwe sectie"}
          closeModal={() => setIsModalOpen(false)}
        >
          <AddSection onClose={() => setIsModalOpen(false)}></AddSection>
        </Modal>
      )}
    </>
  );
};

export default ImageConfigurator;
