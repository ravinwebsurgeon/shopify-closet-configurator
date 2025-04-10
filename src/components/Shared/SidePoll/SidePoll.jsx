import React from "react";
import ShelfRemoveBtn from "../../ShelfRemove/ShelfRemoveBtn";
import ShelveChangeIndicator from "../../ShelvingConfigurator/ShelveChangeIndicator/ShelveChangeIndicator";
import DeleteAndConfirm from "../../DeleteAndConfirm/DeleteAndConfirm";
import CompartmentDelete from "../../Compartments/CompartmentDelete";
import { useSelector } from "react-redux";

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
  return (
    <div>
      {isCompartmentHighlighted && (
        <CompartmentDelete
          section={section}
          sectionKey={sectionKey}
          isShelfSelected={isShelfSelected}
        />
      )}
      {isShelfSelected?.key != "" && sectionKey == selectedSection ? (
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
