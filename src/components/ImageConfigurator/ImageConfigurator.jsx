import React, { useEffect, useRef, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import "./ImageConfigurator.css";
import AddSection from "../ModalChildComponents/AddSectionComponent/AddSection";
import {
  deleteSection,
  setCompartmentHighlighted,
  setCurrSelectedSection,
  setDrawerHighlighted,
  setEditingBackwall,
  setEditingSides,
  setHideDoor,
  updateSideWall,
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
import {
  faArrowLeftLong,
  faArrowRightLong,
  faEye,
  faEyeSlash,
  faRuler,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CompartmentsButton from "../Compartments/CompartmentsButton";
import { setCurrSelectedWoodSection } from "../../slices/WoodShelfDetailSlice";
import DimensionVisualizer from "../DimensionVisualizerComponent/DimensionVisualizer";

const ImageConfigurator = () => {
  const dispatch = useDispatch();
  const [positionArr, setPositionArr] = useState([]);
  const [backWallSelectedSection, setBackWallSelectedSection] = useState("");

  const metalConfig = useSelector((state) => state.shelfDetail.configuration);
  const woodConfig = useSelector(
    (state) => state.woodShelfDetail.configuration
  );
  const metalRacks = useSelector((state) => state.shelfDetail.racks);
  const woodRacks = useSelector((state) => state.woodShelfDetail.racks);
  const hideDoor = useSelector((state) => state.shelfDetail.hideDoor);

  const scrollRef = useRef(null);
  const [prevSection, setPrevSection] = useState({
    key: "",
  });

  const [isHighlighted, setisHighlighted] = useState({
    left: "",
    right: "",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [translate, setTranslate] = useState(30);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef(null);
  const selectSectionDivRef = useRef(null);

  const [isShelfSelected, setIsShelfSelected] = useState({
    key: "",
    top: "0",
  });
  const [topPosition, setTopPosition] = useState(null);

  const executionValues = metalRacks?.execution;

  const initialShelfValue =
    executionValues.material == "metal" ? metalConfig : woodConfig;

  const currentSelectedSection =
    executionValues.material == "metal"
      ? metalRacks.selectedSection
      : woodRacks.selectedSection;

  const [selectedSection, setSelectedSection] = useState("");

  const sectionz =
  executionValues.material == "metal"
    ? metalRacks.sections
    : woodRacks.sections;

  const sectionKeyz = Object.keys(sectionz)

  const prevSectionKeysLength = useRef(sectionKeyz.length);

  //calculate scale based on height
  const calculateScale = () => {
    const maxSectionHeight = Object.values(sectionz).reduce((max, section) => {
      const height = parseInt(section.height, 10);
      return height > max ? height : max;
    }, 0);

    if (maxSectionHeight > 300) return 0.7;
    if (maxSectionHeight > 200) return 0.9;
    return 1;
  };

  // Get the current sections height
  // const currentSectionHeight = sectionz[selectedSection]?.height || 200;

   const scale = calculateScale();

  useEffect(() => {
    setSelectedSection(currentSelectedSection);
  }, [currentSelectedSection]);

  const [selectedShelf, setSelectedShelf] = useState(null);

  const newInitialValue =
    executionValues.material == "metal" ? metalRacks : woodRacks;

  const editingSides = metalRacks?.isEditingSides;

  const isEdtingWall = metalRacks?.isEditingBackwall;

  const shelfCount = initialShelfValue.shelfCount;
  const currShelfHeight = initialShelfValue.height;

  const sections =
    executionValues.material == "metal"
      ? metalRacks.sections
      : woodRacks.sections;

  const sectionKeys = Object.keys(sections);

  const isPrevDisabled = sectionKeys.length <= 1 || selectedIndex === 0;
  const isNextDisabled =
    sectionKeys.length <= 1 || selectedIndex === sectionKeys.length - 1;

  const handlePrev = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);

      const newSectionKey = sectionKeys[newIndex];
      setSelectedSection(newSectionKey);

      if (executionValues.material === "metal") {
        dispatch(setCurrSelectedSection(newSectionKey));
      } else {
        dispatch(setCurrSelectedWoodSection(newSectionKey));
      }

      //  for scrolling section button into view
      const sectionButtons = document.querySelector('.selectSectionDiv');
      const targetButton = sectionButtons.children[newIndex];
      if (targetButton) {
        targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handleNext = () => {
    if (selectedIndex < sectionItems.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      const newSectionKey = sectionKeys[newIndex];
      setSelectedSection(newSectionKey);
      if (executionValues.material === "metal") {
        dispatch(setCurrSelectedSection(newSectionKey));
      } else {
        dispatch(setCurrSelectedWoodSection(newSectionKey));
      }

       //  for scrolling section button into view
       const sectionButtons = document.querySelector('.selectSectionDiv');
       const targetButton = sectionButtons.children[newIndex];
       if (targetButton) {
         targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
       }
    }
  };

  useEffect(() => {
    // function used to calculate center position based on selected index
    const totalSections = sectionKeys.length;
    const centerOffset = 50;
    const sectionOffset = selectedIndex * (100 / totalSections);
    const newTranslate = centerOffset - sectionOffset;
    setTranslate(newTranslate);
  }, [selectedIndex, sectionKeys.length]);

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

  const handleSectionDelete = () => {
    const activeIndex = sectionKeys.indexOf(currentSelectedSection);
    const nextSectionId =
      activeIndex < sectionKeys.length ? sectionKeys[activeIndex + 1] : null;
    const prevSectionId =
      activeIndex < sectionKeys.length ? sectionKeys[activeIndex - 1] : null;
    const selectedSection = sections[currentSelectedSection];
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
    dispatch(
      setCurrSelectedSection(prevSectionId ? prevSectionId : nextSectionId)
    );

    dispatch(deleteSection(currentSelectedSection));
  };

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
        !event.target.closest(".glb-remove-confirm") &&
        !event.target.closest(".configuration-options") &&
        !event.target.closest(".modal-container")
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

    const indexData = sectionItems.indexOf(sectionKey);
    const totalSections = sectionItems.length;
    const centerOffset = 50;
    const sectionWidth = 100 / totalSections;
    const newTranslate = centerOffset - indexData * sectionWidth;
    setTranslate(newTranslate);

    const index = sectionItems.findIndex((item) => item.key === sectionKey);

    if (index !== -1) {
      setSelectedIndex(index);
    }

    if (executionValues.material == "metal") {
      dispatch(setCurrSelectedSection(sectionKey));
    } else {
      dispatch(setCurrSelectedWoodSection(sectionKey));
    }
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
    if (currentSelectedSection != sectionkey) {
      handleSectionClick(e, sectionkey);
      setSelectedShelf(null);
      setIsShelfSelected({
        key: "",
        top: "0",
      });
      return;
    }
    setIsShelfSelected((prev) => ({
      ...prev,
      key: shelfkey,
    }));
    setSelectedShelf(value);
    setTopPosition(position);
    dispatch(setHideDoor(true));
  };
  const sectionItems = Object.keys(sections);

  const maxHeight = sectionItems
    .map((item) => parseInt(sections[item].height, 10))
    .sort((a, b) => b - a)[0];

  const depth =
    executionValues.material == "metal" ? metalRacks.depth : woodRacks.depth;

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
    setSelectedIndex(activeIndex);
  }, [selectedSection]);

  useEffect(() => {
    if (selectSectionDivRef.current && sectionKeyz.length > 0) {
      // Only scroll if a new section was added (length increased)
      const isNewSection = sectionKeyz.length > prevSectionKeysLength.current;
      if (isNewSection) {
        selectSectionDivRef.current.scrollTo({
          left: selectSectionDivRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
      prevSectionKeysLength.current = sectionKeyz.length;
    }

  }, [sectionKeyz.length]);

  return (
    <>
      <div
        ref={containerRef}
        className="visualFrame_container ConfiguratorEditView_visualFrame__5OS3U"
      >
        <div className="row-container visualFrame-top max-dex-sm:flex-col max-dex-sm:gap-4 max-tab-sm:items-center">
          <div className="addsection-div flex gap-[5px] !justify-start items-center ">
            <span className="font-inter font-medium text-[12px] whitespace-nowrap">
              Selecteer sectie:
            </span>
            <div ref={selectSectionDivRef} className="selectSectionDiv flex gap-1 w-[440px] max-dex-md:max-w-[220px] max-dex-sm:max-w-[90vw] flex-1 max-dex-md:w-full overflow-x-auto scrollbar-hidden">
            {sectionKeys.map((item, index) => (
              <button
                onClick={(e) => handleSectionClick(e, item)}
                key={item}
                className={` flex-shrink-0 ${
                  item == selectedSection
                    ? "_selected border-[#0665C5] !bg-[#0665C5] !text-[#fff]"
                    : "border-[rgba(0,0,0,0)]"
                } bg-[rgba(0,0,0,0.1)] border font-inter cursor-pointer font-medium text-[12px] leading-none text-black rounded-[5px] w-[30px] h-[30px] flex justify-center items-center`}
              >
                {index + 1}
              </button>
            ))}
            </div>
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
          <div className="flex">
            <button
              className=" h-[30px] mr-[10px]  py-[10px] px-[15px] whitespace-nowrap cursor-pointer border border-[#C50606] bg-[#C50606] flex gap-2 items-center justify-center font-medium font-inter rounded-[5px] text-[#fff] text-[10px] disabled:cursor-not-allowed disabled:opacity-50 "
              disabled={sectionKeys.length <= 1}
              onClick={handleSectionDelete}
            >
              <span className="">Deze sectie verwijderen</span>{" "}
              <span className="font-inter font-light leading-none tracking-normal text-[#fff] mt-[-5px]">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>

            <button
              className=" h-[30px] mr-[94px] max-dex-md:mr-[45px] max-tab-sm:mr-0  py-[10px] px-[15px] whitespace-nowrap cursor-pointer border border-[#0665C5] bg-[#0665C5] flex gap-2 items-center justify-center font-medium font-inter rounded-[5px] text-[#fff] text-[10px]"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="">Setie toevoegen</span>{" "}
              <span className="font-inter font-light text-[30px] leading-none tracking-normal text-[#fff] mt-[-5px]">
                +
              </span>
            </button>
          </div>
        </div>
        <div className="Demo-test flex justify-between gap-5 items-center">
          <button
            className={`selection-none border border-[#0665C5] rounded h-[30px] px-[10px] bg-[#0665C5] text-[#fff]
                       disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isPrevDisabled}
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </button>
          <div
            ref={scrollRef}
            className="demo-config w-[800px] overflow-hidden max-dex-xl:w-full max-dex-xl:flex-1"
            id="shelf-capture-area"
          >
            <div className="main-wrapper__ relative "
              style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s ease-in-out'
            }}
            >
              {/* <SectionDimensionsIndicator /> */}
              <div
                className="Visual_container__tG7BQ Carousel_visual__FfW0p transition-all duration-500 ease-in-out"
                style={{ transform: `translateX(${translate}%)` }}
              >
                {/* <div
                  className={`arrows-dimensionsIndicator-left relative flex items-center justify-center translate-x-[0px]   !p-0 !m-0  Section_width
            bg-[#d4d7db] w-[2px]
            `}
                >
                  <span
                    className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#d4d7db] font-inter`}
                  >
                    {maxHeight + 2.7} cm
                  </span>
                </div> */}
                {/* Appending racks according to data we got */}
                {newInitialValue &&
                  Object.entries(newInitialValue.sections).map(
                    ([sectionKey, section], index) => (
                      <React.Fragment key={sectionKey}>
                        {/* first two poles section */}

                        <div
                          className={`Staander_Staander__rAo9j Visual_animating__a8ZaU 
                                      ${
                                        executionValues.color === "black" &&
                                        executionValues.material == "metal"
                                          ? "Staander_black"
                                          : ""
                                      } 
                                      ${
                                        executionValues.topCaps === "topCaps" &&
                                        executionValues.material == "metal"
                                          ? "Staander_hasTopdoppen"
                                          : ""
                                      } 
                                      ${
                                        executionValues.material == "metal"
                                          ? "Staander_metal "
                                          : "Staander_wood"
                                      }
                                      Staander_${executionValues.feet}_Feet  
                                      Staander_height${
                                        section?.height || 100
                                      } ${index > 0 ? "hidden" : ""}   `}
                          style={{
                            zIndex: index,
                            opacity: selectedSection === sectionKey ? 1 : 0.5,
                            transition: "opacity 0.3s ease-in-out",
                          }}
                          key={index}
                        >
                          <div className="Staander_achter__8cpuX change__color">
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
                          <div className="Staander_voor__AegR3 change__color">
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
                              prevKey={prevSection?.key}
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
                            className={`Section_Section__3MCIu  Visual_animating__a8ZaU 
                              ${
                                executionValues.color === "black"
                                  ? "Section_black"
                                  : ""
                              } 
                              ${
                                executionValues.material == "metal"
                                  ? "Section_metal__c "
                                  : "Section_wood"
                              }
                              Section_height${
                                section.height || 100
                              } Section_width${section.width || 55}`}
                            style={{
                              zIndex: index,
                              opacity: selectedSection === sectionKey ? 1 : 0.5,
                              transition: "opacity 0.3s ease-in-out",
                            }}
                          >
                            {/* {selectedSection === sectionKey &&
                              isShelfSelected?.key == "" && (
                                <div
                                  className={`arrows-dimensionsIndicator-left _selected !left-[-30%] relative flex items-center justify-center translate-x-[0px]   !p-0 !m-0  Section_width bg-[#3c9cea] w-[2px]`}
                                >
                                  <span
                                    className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-inter`}
                                  >
                                    {parseFloat(section.height) + 2.7} cm
                                  </span>
                                </div>
                              )} */}
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
                                        {shelfkey.includes("wardrobe_") && (
                                          <WardrobeRods
                                            key={shelfkey}
                                            doorKey={shelfkey}
                                            type={shelf.type}
                                            top={shelf.position.top}
                                            index={arr.length - index}
                                            width={section.width}
                                            section={sectionKey}
                                            height={shelf.height}
                                          />
                                        )}
                                        {!shelfkey.includes("compartment") &&
                                          !shelfkey.includes("wardrobe_") &&
                                          !shelfkey.includes("drawer_") && (
                                            <div
                                              className={`Legbord_Legbord__Outer change__color`}
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
                                                            executionValues.material ==
                                                            "wood"
                                                              ? "Legboard_wood"
                                                              : ""
                                                          }
                                                          ${
                                                            executionValues.color ===
                                                              "black" &&
                                                            executionValues.material ==
                                                              "metal"
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
                                                compartments={
                                                  shelf?.compartments
                                                }
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

                            {(executionValues.material == "wood" ||
                              ((getMaxHeight() ||
                                (index % 4 === 0 &&
                                  sections[sectionKey].height > 100)) &&
                                executionValues.braces == "X-braces")) && (
                              <XBrace />
                            )}

                            {Number(section?.width) < 115 && (
                              <BackWall
                                type={sections[sectionKey].backWall.type}
                                height={sections[sectionKey].backWall.height}
                                id={sectionKey}
                                selectedSectionBackWall={
                                  backWallSelectedSection
                                }
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
                          className={`Staander_Staander__rAo9j Visual_animating__a8ZaU Staander_notFirst__FSKKl  
                  ${executionValues.color === "black" ? "Staander_black" : ""} 
                  ${
                    executionValues.topCaps === "topCaps"
                      ? "Staander_hasTopdoppen"
                      : ""
                  }
                  ${
                    executionValues.material == "metal"
                      ? "Staander_metal "
                      : "Staander_wood"
                  } 
                  Staander_${executionValues.feet}_Feet 
                  Staander_height${section?.standHeight || 100}
                  
                  `}
                          style={{
                            zIndex: index,
                            opacity:
                              prevSection.key === sectionKey ||
                              selectedSection === sectionKey
                                ? 1
                                : 0.5,
                            transition: "opacity 0.3s ease-in-out",
                          }}
                        >
                          {sections[sectionKey].sideWall.right.isRight && (
                            <SideWall
                              type={sections[sectionKey].sideWall.right.type}
                              height={
                                sections[sectionKey].sideWall.right.height
                              }
                              highlighted={isHighlighted.right === sectionKey}
                            />
                          )}

                          <div className="Staander_achter__8cpuX change__color">
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
                            !sections[selectedSection].sideWall.right
                              .isRight && <EditingSides />}

                          <div className="Staander_voor__AegR3 change__color">
                            <div className="Staander_voorTop__1m0QA"></div>
                            <div className="Staander_voorMiddle__O-Po9"></div>
                            <div className="Staander_voorBottom__dVzsj"></div>
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  )}
                {/* <div
                  className={`arrows-dimensionsIndicator-left arrows-dimensionsIndicator-depth _selected  relative flex items-center justify-center translate-x-[0px]  !p-0 !m-0  Section_width
            bg-[#3c9cea] w-[2px]
            `}
                >
                  <span
                    className={`text-sm bg-white -rotate-90 px-2 whitespace-nowrap font-bold text-[#5c5c5c] font-inter`}
                  >
                    {depth + 2.5} cm
                  </span>
                </div> */}
              </div>
            </div>
            <DimensionVisualizer
              height={sections[currentSelectedSection].height}
              width={sections[currentSelectedSection].width}
              depth={depth}
            />
          </div>
          <button
            className={`selection-none mr-[45px] border border-[#0665C5] rounded h-[30px] px-[10px] bg-[#0665C5] text-[#fff]
        disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isNextDisabled}
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faArrowRightLong} />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          mainHeading={"Nieuwe sectie"}
          closeModal={() => setIsModalOpen(false)}
        >
          <AddSection
            onClose={() => setIsModalOpen(false)}
            translate={translate}
            setTranslate={setTranslate}
          ></AddSection>
        </Modal>
      )}
    </>
  );
};

export default ImageConfigurator;
