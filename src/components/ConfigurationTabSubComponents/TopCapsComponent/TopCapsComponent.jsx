import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExecution } from "../../../slices/shelfDetailSlice";

const TopCapsComponent = () => {
  const dispatch = useDispatch();

  const executionDetails = useSelector(
    (state) => state.shelfDetail.racks.execution
  );

  const [selectedTopCaps, setSelectedTopCaps] = useState(null);

  const topCapsOptions = [
    { type: "topCaps", label: "Met topdoppen" },
    { type: "noTopCaps", label: "Zonder topdoppen" },
  ];

  useEffect(() => {
    setSelectedTopCaps(
      topCapsOptions.find((item) => item.type === executionDetails.topCaps) ||
        topCapsOptions[0]
    );
  }, [executionDetails]);

  const handleTopCapsClick = (e, item) => {
    e.preventDefault();
    setSelectedTopCaps(item);
    dispatch(updateExecution({ topCaps: item.type }));
  };

  return (
    <>
      <div className="topcaps-container">
        <div className="topcaps-label-div mt-2">
          <div className="border border-[#EB6200] rounded-[5px] flex">
            {topCapsOptions.map((item) => (
              <div
                className={` cursor-pointer py-[7px]  font-inter text-xs tracking-[-2%] leading-[150%] font-semibold px-6 transition-all duration-300 ${
                  selectedTopCaps?.type === item.type
                    ? "bg-[#EB6200] text-white"
                    : "text-black"
                }`}
                key={item.type}
                onClick={(e) => handleTopCapsClick(e, item)}
              >
                {item.label}
              </div>
            ))}{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopCapsComponent;
