import React from "react";
import { useSelector } from "react-redux";

const SectionDimensionsIndicator = () => {
  const widths = {
    55: "21.5em",
    60: "22.5em",
    70: "28em",
    75: "31em",
    85: "35.5em",
    100: "45em",
    115: "52.5em",
    120: "53.5em",
    130: "60em",
  };
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );

  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const sectionItems = Object.keys(sections);
  const totalWidth = sectionItems.reduce((acc, item) => {
    return acc + sections[item].width;
  }, 0); 


  return (
    <div className=" mb-4">
         
       <div
            className={`!h-[2px] arrows-dimensionsIndicator w-[calc(100%-21px)] !mb-4 relative flex items-center justify-center translate-x-[24px]  Section_Section__3MCIu !p-0 !m-0  Section_width
          bg-[#d4d7db]
          `}

          >
            <span
              className={`text-sm bg-white px-2 whitespace-nowrap font-bold text-[#d4d7db] font-inter`}
            >
              {totalWidth + 4 + 0.3 * sectionItems.length} cm
            </span>
          </div>
      <div className="relative flex items-center text-[3.3px] gap-[4px]">
        {sectionItems.map((item) => (
          <div
            key={item}
            className={`!h-[2px] arrows-dimensionsIndicator relative flex items-center justify-center translate-x-[24px]  Section_Section__3MCIu !p-0 !m-0  Section_width
          ${selectedSection == item ? "bg-[#3c9cea] _selected" : "bg-[#d4d7db]"}
          `}
            style={{ width: widths[sections[item].width] }}
          >
            <span
              className={`text-sm bg-white px-2 whitespace-nowrap font-bold ${
                selectedSection == item ? "text-[#5c5c5c] " : "text-[#d4d7db] "
              } font-inter`}
            >
              {sections[item].width} cm
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionDimensionsIndicator;
