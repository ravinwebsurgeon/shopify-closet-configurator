import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateExecution } from "../../../slices/shelfDetailSlice";

const SustainComponent = () => {
  const executionDetails = useSelector(
    (state) => state.shelfDetail.racks.execution
  );

  const dispatch = useDispatch();

  const [selectedSustain, setSelectedSustain] = useState(null);

  const sustainOptions = [
    { type: "X-braces", label: "X-schoren" },
    { type: "H-braces", label: "H-schoren" },
  ];

  useEffect(() => {
    setSelectedSustain(
      sustainOptions.find(
        (sustain) => sustain.type === executionDetails.braces
      ) || sustainOptions[0]
    );
  }, [executionDetails]);

  const handleSustainClick = (e, sustain) => {
    e.preventDefault();
    setSelectedSustain(sustain);
    dispatch(updateExecution({ braces: sustain.type }));
  };

  return (
    <>
      <div className="sustain-container">
        <div className="sustain-label-div !gap-0  mt-2">
          <div className="border border-[#EB6200] rounded-[5px] flex">
            {sustainOptions.map((sustain) => (
              <div
                className={`add-to-cart cursor-pointer py-[7px]  font-inter text-xs tracking-[-2%] leading-[150%] font-semibold px-6 transition-all duration-300 ${
                  selectedSustain?.type === sustain.type
                    ? "bg-[#EB6200] text-white"
                    : "text-black"
                }`}
                key={sustain.type}
                onClick={(e) => handleSustainClick(e, sustain)}
              >
                {sustain.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SustainComponent;
