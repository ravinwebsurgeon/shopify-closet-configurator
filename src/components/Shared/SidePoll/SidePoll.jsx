import React from "react";
import ShelfRemoveBtn from "../../ShelfRemove/ShelfRemoveBtn";
import ShelveChangeIndicator from "../../ShelvingConfigurator/ShelveChangeIndicator/ShelveChangeIndicator";
import DeleteAndConfirm from "../../DeleteAndConfirm/DeleteAndConfirm";
import CompartmentDelete from "../../Compartments/CompartmentDelete";
import { useSelector } from "react-redux";
import DrawersDelete from "../../Drawers/DrawersDelete";
import RevolvingDoorDelete from "../../RevolvingDoors/RevolvingDoorDelete";
import RevolvingDoorSetShelves from "../../RevolvingDoors/RevolvingDoorSetShelves";
import SlidingDoorDelete from "../../SlidingDoors/SlidingDoorDelete";
import SlidingDoorSetShelves from "../../SlidingDoors/SlidingDoorSetShelves";
import WardrobeRodsDelete from "../../WardrobeRods/WardrobeRodsDelete";

const SidePoll = ({
  isShelfSelected,
  sectionKey,
  selectedSection,
  section,
  setSelectedShelf,
  closeShelfDeleteModal,
}) => {
  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  const highlightedDrawer = useSelector(
    (state) => state.shelfDetail.highlightedDrawer
  );
  const isRevolvingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isRevolvingDoorHighlighted
  );
  const isSlidingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isSlidingDoorHighlighted
  );
  const isWardrobeHighlighted = useSelector(
    (state) => state.shelfDetail.isWardrobeHighlighted
  );
  return (
    <div>
      {isCompartmentHighlighted && sectionKey == selectedSection && (
        <CompartmentDelete
          section={section}
          sectionKey={sectionKey}
          isShelfSelected={isShelfSelected}
        />
      )}
      {highlightedDrawer?.shelfkey && sectionKey == selectedSection && (
        <DrawersDelete section={section} sectionKey={sectionKey} />
      )}
      {isRevolvingDoorHighlighted && sectionKey == selectedSection && (
        <RevolvingDoorDelete
          section={section}
          door={isRevolvingDoorHighlighted}
        />
      )}
      {isSlidingDoorHighlighted && sectionKey == selectedSection && (
        <SlidingDoorDelete door={isSlidingDoorHighlighted} section={section} />
      )}
      {isWardrobeHighlighted && sectionKey == selectedSection && (
        <WardrobeRodsDelete section={section} door={isWardrobeHighlighted} />
      )}
      {!isRevolvingDoorHighlighted && sectionKey == selectedSection && (
        <RevolvingDoorSetShelves section={section} />
      )}
      {!isSlidingDoorHighlighted && sectionKey == selectedSection && (
        <SlidingDoorSetShelves section={section} />
      )}
      {isShelfSelected?.key != "" && sectionKey == selectedSection ? (
        <div
          className={`shelfRemoveBtnOver shelfRemove_bottom${section?.height} shelfRemove_width${section?.width}`}
        >
          <ShelfRemoveBtn
            top={isShelfSelected?.top}
            shelfId={isShelfSelected?.key}
            onClick={() => setSelectedShelf(false)}
            onClose={closeShelfDeleteModal}
          />
        </div>
      ) : (
        ""
      )}
      {isShelfSelected?.key != "" && sectionKey == selectedSection && (
        <ShelveChangeIndicator
          selectedShelfKey={isShelfSelected?.key}
          selectedSectionKey={selectedSection}
        />
      )}
    </div>
  );
};

export default SidePoll;
