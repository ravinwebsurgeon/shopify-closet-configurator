import React from "react";
import CompartmentsButton from "./CompartmentsButton";

const CompartmentViewer = ({
  shelf,
  shelfkey,
  arr,
  index,
  selectedSection,
  sectionKey,
}) => {
  return (
    <div
      key={shelfkey}
      data-type="compartment"
      className={`Legbord_Legbord__Outer !absolute w-full Legbord__${shelf?.compartments?.type}`}
      style={{
        zIndex: arr.length - index,
        top: shelf?.compartments.position.top,
      }}
    >
      {shelf?.compartments?.type == "compartment_divider_set" && (
        <CompartmentsButton
          shelfkey={shelfkey}
          selectedSection={selectedSection === sectionKey}
          compartments={shelf?.compartments}
          type="compartment_divider_set"
        />
      )}
      {shelf?.compartments?.type == "sliding_partition" &&
        Array.from(
          {
            length: shelf?.compartments?.count,
          },
          (_, i) => i + 1
        ).map((index) => (
          <CompartmentsButton
            shelfkey={shelfkey}
            index={index}
            selectedSection={selectedSection === sectionKey}
            compartments={shelf?.compartments}
            type="sliding_partition"
          />
        ))}
    </div>
  );
};

export default CompartmentViewer;
