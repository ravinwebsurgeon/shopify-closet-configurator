import React, { useEffect, useRef, useState } from "react";
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

const ImageConfigurator = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.shelfDetail.racks.activeTab); 
  const showCounter = useSelector((state) =>state.shelfDetail.racks.showCounter);
  const [positionArr, setPositionArr] = useState([]);
  const [racks, setRacks] = useState([]);
  const [selectedRack, setSelectedRack] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

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

  const shelfCount = initialShelfValue.shelfCount;
  const currShelfHeight = initialShelfValue.height;
  const shelfDepth = initialShelfValue.depth;
  const rackWidth = initialShelfValue.width || 55;

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
        !event.target.closest(".Legbord_Legbord__k51II")
      ) {
        setSelectedShelf(null);
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
    dispatch(deleteSection(sectionKey));
  };

  const handleSelectedShelfClick = (e, value, key) => {
    e.preventDefault();
    setSelectedShelf(value);
    handleSectionClick(e, key);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="visualFrame_container ConfiguratorEditView_visualFrame__5OS3U"
      >
        <div className="row-container visualFrame-top">
          <div className="spacer-div"></div>
          <div className="addsection-div">
            <button className="AddSection" onClick={() => setIsModalOpen(true)}>
              {" "}
              + Add Section
            </button>
          </div>
          <div className="hidedoors-div">Hide doors</div>
        </div>
        <div className="demo-config">
          <div className="Visual_container__tG7BQ Carousel_visual__FfW0p">
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
                      <div className="Staander_voor__AegR3">
                        <div className="Staander_voorTop__1m0QA"></div>
                        <div className="Staander_voorMiddle__O-Po9"></div>
                        <div className="Staander_voorBottom__dVzsj"></div>
                      </div>
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
                        <div className="Section_accessoires__+se2+">
                          {section.shelves &&
                            Object.entries(section.shelves).map(
                              ([shelfkey, shelf], index) => (
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
                                  style={{
                                    zIndex: shelf.position.zIndex,
                                    top: shelf.position.top,
                                  }}
                                  key={shelfkey}
                                  onClick={(e) =>
                                    handleSelectedShelfClick(
                                      e,
                                      `${sectionKey}-${shelfkey}`,
                                      `${sectionKey}`
                                    )
                                  }
                                >
                                  <div className="Legbord_inner__eOg0b">
                                    <div className="Legbord_left__ERgV5"></div>
                                    <div className="Legbord_middle__D8U0x"></div>
                                    <div className="Legbord_right__HB8+U"></div>
                                  </div>
                                </button>
                              )
                            )}
                        </div>
                        {/* Here section header dimensions div will come */}
                        <div className="Section_sectionInterface">
                          <div className="Section_sectionNumberContainer sk_hide_on_print">
                            <button
                              className={`Section_sectionNumber ${
                                selectedSection === sectionKey
                                  ? "Section_sectionNumberActive"
                                  : ""
                              }`}
                              onClick={(e) => handleSectionClick(e, sectionKey)}
                            >
                              {index + 1}
                            </button>
                            {selectedSection === sectionKey && (
                              <button
                                type="button"
                                className="AddRemove_button Section_removeButton"
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
                          {(selectedSection == sectionKey) && activeTab == 'shelves' && showCounter && <ShelfCounter onClick={()=>dispatch(setShowCounter(false))}/>}
                        </div>
                      </div>
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
                Staander_height${section?.height || 100}`}
                      style={{ zIndex: index + 1 }}
                    >
                      <div className="Staander_achter__8cpuX">
                        <div className="Staander_achterTop__nQ0aW"></div>
                        <div className="Staander_achterMiddle__XrxPJ"></div>
                        <div className="Staander_achterBottom__YRp6n"></div>
                      </div>
                      <div className="Staander_voor__AegR3">
                        <div className="Staander_voorTop__1m0QA"></div>
                        <div className="Staander_voorMiddle__O-Po9"></div>
                        <div className="Staander_voorBottom__dVzsj"></div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              )}
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
