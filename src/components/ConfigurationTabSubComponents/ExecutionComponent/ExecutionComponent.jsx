import React, { useEffect, useState } from "react";
import "./ExecutionComponent.css";

import plasticFoot from "../../../assets/foot-plastic.png";
import steelPlate from "../../../assets/foot-steel.png";
import steelPlateSnap from "../../../assets/foot-steel-snapin.png";
import Adjustable from "../../../assets/foot-adujustable-legs.png";
import { useDispatch, useSelector } from "react-redux";
import { updateExecution } from "../../../slices/shelfDetailSlice";

const ExecutionComponent = () => {
  const executionDetails = useSelector(
    (state) => state.shelfDetail.racks.execution
  );

  const dispatch = useDispatch();

  const [selectedFoot, setSelectedFoot] = useState(null);
  const [selectedSustain, setSelectedSustain] = useState(null);
  const [selectedTopCaps, setSelectedTopCaps] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const footOptions = [
    { type: "Plastic", image: plasticFoot, label: "Voetje (plastic)" },
    {
      type: "SteelBasePlate",
      image: steelPlate,
      label: "Voetplaat staal verankerbaar",
    },
    {
      type: "SteelBasePlateSnap",
      image: steelPlateSnap,
      label: "Voetplaat staal (inklik)",
    },
    { type: "Adjustable", image: Adjustable, label: "Verstelbaar voetje" },
  ];

  const sustainOptions = [
    { type: "X-braces", label: "X-schoren" },
    { type: "H-braces", label: "H-schoren" },
  ];

  const topCapsOptions = [
    { type: "topCaps", label: "Met topdoppen" },
    { type: "noTopCaps", label: "Zonder topdoppen" },
  ];

  const materialOptions = [
    { type: "metal", label: "Metaal" },
    { type: "wood", label: "Hout" },
  ];
  const colorOptions = [
    { type: "metal", label: "Metaal" },
    { type: "black", label: "Zwart" },
  ];

  useEffect(() => {
    if (executionDetails) {
      setSelectedFoot(
        footOptions.find((foot) => foot.type === executionDetails.feet) ||
          footOptions[0]
      );
      setSelectedSustain(
        sustainOptions.find(
          (sustain) => sustain.type === executionDetails.braces
        ) || sustainOptions[0]
      );
      setSelectedTopCaps(
        topCapsOptions.find((item) => item.type === executionDetails.topCaps) ||
          topCapsOptions[0]
      );
      setSelectedMaterial(
        materialOptions.find((mat) => mat.type === executionDetails.material) ||
          materialOptions[0]
      );
      setSelectedColor(
        colorOptions.find((color) => color.type === executionDetails.color) ||
          colorOptions[0]
      );
    }
  }, [executionDetails]);

  const handleFeetClick = (e, foot) => {
    e.preventDefault();
    setSelectedFoot(foot);
    dispatch(updateExecution({ feet: foot.type }));
  };

  const handleSustainClick = (e, sustain) => {
    e.preventDefault();
    setSelectedSustain(sustain);
    dispatch(updateExecution({ braces: sustain.type }));
  };

  const handleTopCapsClick = (e, item) => {
    e.preventDefault();
    setSelectedTopCaps(item);
    dispatch(updateExecution({ topCaps: item.type }));
  };

  const handleMaterialClick = (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    const selectedMaterial = materialOptions.find(
      (mat) => mat.type === selectedType
    );
    setSelectedMaterial(selectedMaterial);
    dispatch(updateExecution({ material: selectedType }));
  };

  const handleColorClick = (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    const selectedColor = colorOptions.find(
      (color) => color.type === selectedType
    );
    setSelectedColor(selectedColor);
    dispatch(updateExecution({ color: selectedType }));
  };

  return (
    <>
      <div className="execution-content">
        <div className="feet-container">
          <span className="feet-label execution-label">Voetjes</span>
          <div className="grid grid-cols-2 gap-2">
            {footOptions.map((foot) => (
              <div
                key={foot.type}
                className={`foot-selection foot-container-div !w-full ${
                  selectedFoot?.type === foot.type ? "selected" : ""
                }`}
                onClick={(e) => handleFeetClick(e, foot)}
              >
                <div className="foot-img-div">
                  <img src={foot.image} alt={foot.label} />
                </div>
                <span className="foot-selector-text">{foot.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* sustain component */}
        <div className="sustain-container">
          <span className="sustain-label execution-label">Schoren</span>
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
        {/* top caps component */}
        <div className="topcaps-container">
          <span className="topcaps-label execution-label">Topdoppen</span>
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
        {/* Material Select Component */}
        <div className="material-cotainer execution-select-container">
          <span className="material-label execution-label">Materiaal</span>
          <select
            className="execution-select"
            value={selectedMaterial?.type || ""}
            onChange={handleMaterialClick}
            required
          >
            <option value="" disabled>
              Selecteer
            </option>
            {materialOptions.map((val) => (
              <option key={val.type} value={val.type}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
        {/* Color select component */}
        <div className="color-cotainer execution-select-container">
          <span className="color-label execution-label">Kleur</span>
          <select
            className="execution-select"
            value={selectedColor?.type || ""}
            onChange={handleColorClick}
            required
          >
            <option value="" disabled>
            Selecteer
            </option>
            {colorOptions.map((val) => (
              <option key={val.type} value={val.type}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ExecutionComponent;
