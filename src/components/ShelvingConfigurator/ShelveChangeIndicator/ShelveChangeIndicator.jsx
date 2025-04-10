import React from "react";
import { useSelector } from "react-redux";

const ShelveChangeIndicator = ({selectedShelfKey, selectedSectionKey}) => {
    const sections = useSelector((state) => state.shelfDetail.racks.sections);
    const getShelves = sections[selectedSectionKey]?.shelves;
    return (
    <div className="flex flex-col items-center absolute left-[-52px] z-[1]">
      <div className="w-[7px] h-0.5 bg-blue-1000"></div>
      <div className="border-l-2 border-dashed border-blue-1000 mt-1 w-[1px] z-[1] flex-1"></div>
      <span className="bg-blue-1000 font-inter rounded-[20px] text-white text-[10px] font-medium p-2 text-center leading-none shadow-10xl">
        77 cm
      </span>
    </div>
  );
};

export default ShelveChangeIndicator;
