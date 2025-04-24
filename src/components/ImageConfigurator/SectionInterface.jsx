import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSection,
  setCurrSelectedSection,
  setShowCounter,
  updateSideWall,
} from "../../slices/shelfDetailSlice";
import ShelveChangePosition from "../ShelvingConfigurator/ShelveChangePosition/ShelveChangePosition";
import ShelfCounter from "../ConfigurationTabSubComponents/ShelvesComponent/ShelfCounter";
import CompartmentsMoveButton from "../Compartments/CompartmentsMoveButton";
import DrawerChangePosition from "../Drawers/DrawerChangePosition";
import RevolvingDoorMoveButton from "../RevolvingDoors/RevolvingDoorMoveButton";
import SlidingDoorMoveButton from "../SlidingDoors/SlidingDoorMoveButton";
import WardrobeRodsChangePosition from "../WardrobeRods/WardrobeRodsChangePosition";
// import SlidingDoorMoveButton from "../SlidingDoors/SlidingDoorMoveButton";
import { deleteWoodSection, setCurrSelectedWoodSection } from "../../slices/WoodShelfDetailSlice";

const SectionInterface = ({
  selectedSection,
  sectionKey,
  handleSectionClick,
  sectionKeys,
  sections,
  index,
  selectedShelf,
  isShelfSelected,
}) => {
  const dispatch = useDispatch();
  const material = useSelector((state) => state.shelfDetail.racks.execution.material);
  const activeTab = material == "metal" ? 
  useSelector((state) => state.shelfDetail.racks.activeTab):
  useSelector((state) => state.woodShelfDetail.racks.activeTab);
  
  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  const isRevolvingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isRevolvingDoorHighlighted
  );

  const showCounter = useSelector(
    (state) => state.shelfDetail.racks.showCounter
  );
  const handleSectionDelete = (e, sectionKey) => {
    const activeIndex = sectionKeys.indexOf(sectionKey);
    const nextSectionId =
      activeIndex < sectionKeys.length ? sectionKeys[activeIndex + 1] : null;
    const prevSectionId =
      activeIndex < sectionKeys.length ? sectionKeys[activeIndex - 1] : null;
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
    dispatch(setCurrSelectedSection(prevSectionId));

    if(material == "metal"){
      dispatch(deleteSection(sectionKey));
    }
    else{
      dispatch(setCurrSelectedWoodSection(prevSectionId))
      dispatch(deleteWoodSection(sectionKey));
    }

  };
  const highlightedDrawer = useSelector(
    (state) => state.shelfDetail.highlightedDrawer
  );
  const isSlidingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isSlidingDoorHighlighted
  );
  const isWardrobeHighlighted = useSelector(
    (state) => state.shelfDetail.isWardrobeHighlighted
  );
  return (
    <div className="Section_sectionInterface">
      <div className="Section_sectionNumberContainer sk_hide_on_print">
        <button
          className={`Section_sectionNumber font-inter ${
            selectedSection === sectionKey ? "Section_sectionNumberActive" : ""
          }`}
          onClick={(e) => handleSectionClick(e, sectionKey)}
        >
          {index + 1}
        </button>

        {selectedSection === sectionKey && sectionKeys.length > 1 && (
          <button
            type="button"
            className="AddRemove_button Section_removeButton z-[1] cursor-pointer"
            key={sectionKey}
            onClick={(e) => handleSectionDelete(e, sectionKey)}
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

      {isSlidingDoorHighlighted && selectedSection == sectionKey && (
        <SlidingDoorMoveButton selected={isSlidingDoorHighlighted} />
      )}
      {isCompartmentHighlighted && selectedSection == sectionKey && (
        <CompartmentsMoveButton selected={isCompartmentHighlighted} />
      )}
      {isRevolvingDoorHighlighted && selectedSection == sectionKey && (
        <RevolvingDoorMoveButton selected={isRevolvingDoorHighlighted} />
      )}
      {selectedSection == sectionKey && selectedShelf && (
        <ShelveChangePosition
          sectionId={selectedSection}
          shelfKey={isShelfSelected?.key}
        />
      )}
      {selectedSection == sectionKey && highlightedDrawer && (
        <DrawerChangePosition
          sectionId={selectedSection}
          selected={highlightedDrawer}
        />
      )}
      {selectedSection == sectionKey && isWardrobeHighlighted && (
        <WardrobeRodsChangePosition selected={isWardrobeHighlighted} />
      )}
      <ShelfCounter
        showCounter={
          selectedSection == sectionKey && activeTab == "shelves" && showCounter
        }
        onClick={() => dispatch(setShowCounter(false))}
      />
    </div>
  );
};

export default SectionInterface;
