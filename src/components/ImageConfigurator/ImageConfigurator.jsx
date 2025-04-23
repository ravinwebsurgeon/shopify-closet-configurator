import React, { useEffect, useRef, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import "./ImageConfigurator.css";
import AddSection from "../ModalChildComponents/AddSectionComponent/AddSection";
import {
  setCompartmentHighlighted,
  setCurrSelectedSection,
  setDrawerHighlighted,
  setEditingBackwall,
  setEditingSides,
  setHideDoor,
} from "../../slices/shelfDetailSlice";
import SectionDimensionsIndicator from "../SectionDimensionsIndicator/SectionDimensionsIndicator";
import EditingSides from "../ConfigurationTabSubComponents/SidesComponent/EditingSides";
import SideAddBtn from "../SidesComp/SideAddBtn";
import SideWall from "../SideWallComponent/SideWall";
import BackAddBtn from "../BackAddBtn/BackAddBtn";

import XBrace from "../XBraceComponent/XBrace";
import EditingBack from "../ConfigurationTabSubComponents/BackwallComponent/EditingBack";
import BackWall from "../BackComponent/BackWall";
import SidePoll from "../Shared/SidePoll/SidePoll";
import Modal from "../Shared/Modal/Modal";
import WardrobeRods from "../WardrobeRods/WardrobeRods";
import SectionInterface from "./SectionInterface";
import CompartmentViewer from "../Compartments/CompartmentViewer";
import DrawersButton from "../Drawers/DrawersButton";
import RevolvingDoor from "../RevolvingDoors/RevolvingDoor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CompartmentsButton from "../Compartments/CompartmentsButton";
import SlidingDoorViewer from "../SlidingDoors/SlidingDoorViewer";

const ImageConfigurator = () => {
  const dispatch = useDispatch();
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

  const [selectedSection, setSelectedSection] = useState("");
  useEffect(() => {
    setSelectedSection(currentSelectedSection);
  }, [currentSelectedSection]);
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

  const hideDoor = useSelector((state) => state.shelfDetail.hideDoor);

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
        dispatch(setDrawerHighlighted(""));
        dispatch(setHideDoor(false));
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
    dispatch(setHideDoor(true));
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
          <div className="addsection-div flex gap-[5px] !justify-start">
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
          <div
            className=" hidden flex items-center gap-4 justify-center w-[30%] cursor-pointer select-none 
            text-[12px] font-inter text-[#0665C5]"
            onClick={() => dispatch(setHideDoor(!hideDoor))}
          >
            {!hideDoor ? (
              <>
                <FontAwesomeIcon icon={faEyeSlash} />
                <p>Verberg deuren</p>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEye} />
                <p>Toon deuren</p>
              </>
            )}
          </div>
        </div>
        <div className="demo-config" id="shelf-capture-area">
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
                                ([shelfkey, shelf], index, arr) => {
                                  return (
                                    <React.Fragment key={shelfkey}>
                                      {shelf?.compartments &&
                                        shelfkey.includes("compartment") && (
                                          <CompartmentViewer
                                            key={shelfkey}
                                            arr={arr}
                                            index={index}
                                            sectionKey={sectionKey}
                                            selectedSection={selectedSection}
                                            shelf={shelf}
                                            shelfkey={shelfkey}
                                          />
                                        )}
                                      {shelfkey.includes("drawer_") && (
                                        <DrawersButton
                                          key={shelfkey}
                                          arr={arr}
                                          index={index}
                                          shelf={shelf}
                                          shelfkey={shelfkey}
                                        />
                                      )}
                                      {shelfkey.includes("slidingDoors") && (
                                        <SlidingDoorViewer
                                          key={shelfkey}
                                          doorKey={shelfkey}
                                          type={shelf.type}
                                          position={shelf.position}
                                          width={section.width}
                                          section={sectionKey}
                                        />
                                      )}
                                      {shelfkey.includes("revolvingDoors_") && (
                                        <RevolvingDoor
                                          key={shelfkey}
                                          doorKey={shelfkey}
                                          type={shelf.type}
                                          position={shelf.position}
                                          width={section.width}
                                          section={sectionKey}
                                          height={shelf.height}
                                        />
                                      )}
                                      {!shelfkey.includes("slidingDoors") &&
                                        !shelfkey.includes("revolvingDoors_") &&
                                        !shelfkey.includes("compartment") &&
                                        !shelfkey.includes("drawer_") && (
                                          <div
                                            className={`Legbord_Legbord__Outer`}
                                            data-key={shelfkey}
                                            data-type="shelve"
                                            style={{
                                              zIndex: arr.length - index,
                                              top: shelf.position.top,
                                            }}
                                          >
                                            <button
                                              className={`Legbord_Legbord__k51II Section_legbord__n3SHS  
                                                        ${
                                                          executionValues.color ===
                                                          "black"
                                                            ? "Legbord_black"
                                                            : "Legbord_metal"
                                                        } Legbord_clickable__uTn2b
                                                        ${
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
                                              compartments={shelf?.compartments}
                                              type="compartment_divider_set"
                                            >
                                              <div className="Legbord_inner__eOg0b">
                                                <div className="Legbord_left__ERgV5"></div>
                                                <div className="Legbord_middle__D8U0x"></div>
                                                <div className="Legbord_right__HB8+U"></div>
                                              </div>
                                            </button>
                                          </div>
                                        )}
                                    </React.Fragment>
                                  );
                                }
                              )}
                            {section?.revolvingDoor &&
                              Object.entries(section.revolvingDoor).map(
                                ([key, door], index) => {
                                  return (
                                    <RevolvingDoor
                                      key={key}
                                      doorKey={key}
                                      type={door.type}
                                      position={door.position}
                                      width={section.width}
                                      section={sectionKey}
                                    />
                                  );
                                }
                              )}
                          </div>
                          {/* Here section header dimensions div will come */}
                          <SectionInterface
                            handleSectionClick={handleSectionClick}
                            index={index}
                            isShelfSelected={isShelfSelected}
                            sectionKey={sectionKey}
                            sectionKeys={sectionKeys}
                            sections={sections}
                            selectedSection={selectedSection}
                            selectedShelf={selectedShelf}
                          />
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
