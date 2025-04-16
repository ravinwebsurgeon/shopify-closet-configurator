import React from "react";
import ShelfRemoveBtn from "../../ShelfRemove/ShelfRemoveBtn";
import ShelveChangeIndicator from "../../ShelvingConfigurator/ShelveChangeIndicator/ShelveChangeIndicator";
import DeleteAndConfirm from "../../DeleteAndConfirm/DeleteAndConfirm";
import CompartmentDelete from "../../Compartments/CompartmentDelete";
import { useSelector } from "react-redux";
import RevolvingDoorDelete from "../../RevolvingDoors/RevolvingDoorDelete";

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
  const isRevolvingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isRevolvingDoorHighlighted
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
      {isRevolvingDoorHighlighted && sectionKey == selectedSection && (
        <RevolvingDoorDelete
            section={section}
            door={isRevolvingDoorHighlighted}
        />
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
