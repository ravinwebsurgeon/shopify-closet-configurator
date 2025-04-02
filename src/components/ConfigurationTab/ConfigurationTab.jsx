import React, { useState } from "react";
import "./Configurationtab.css";
import DimensionsComponent from "../ConfigurationTabSubComponents/DimensionsComponent/DimensionsComponent";
import ExecutionComponent from "../ConfigurationTabSubComponents/ExecutionComponent/ExecutionComponent";
import ShelvesComponent from "../ConfigurationTabSubComponents/ShelvesComponent/ShelvesComponent";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab, setShowCounter } from "../../slices/shelfDetailSlice";
import SidesComponent from "../ConfigurationTabSubComponents/SidesComponent/SidesComponent";


const ConfigurationTab = () => {
  const activeTab = useSelector((state) => state.shelfDetail.racks.activeTab);  

  const dispatch = useDispatch();

  const handleSectionClick = (sectionKey) => {
    dispatch(setActiveTab(sectionKey));
    if(sectionKey == "shelves") dispatch(setShowCounter(true));
  };
  const configTabs = [
    { id: "dimensions",label: "Dimensions",component: <DimensionsComponent />},
    { id: "execution", label: "Execution", component: <ExecutionComponent /> },
    { id: "shelves", label: "Shelves", component: <ShelvesComponent /> },
    { id: "sides", label: "Sides",component:<SidesComponent/> },
    { id: "backwalls", label: "Back walls" },
    { id: "compartments", label: "Compartments" },
    { id: "revolvingdoors", label: "Revolving doors" },
    { id: "slidingdoors", label: "Sliding doors" },
    { id: "drawers", label: "Drawers" },
    { id: "wardroberods", label: "Wardrobe rods" },
  ];

  return (
    <div className="configuration-options">
      <div className="config-tabs">
        {configTabs.map((tab) => (
          <button
            key={tab.id}
            className={`config-tab ${activeTab == tab.id ? "active" : ""}`}
            onClick={() => handleSectionClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="config-content">
        {/* {renderTabContent()} */}
        {configTabs.find((tab) => tab.id === activeTab)?.component || (
          <p style={{ fontFamily: "Ubuntu" }}>Not yet available !!!</p>
        )}
      </div>
    </div>
  );
};

export default ConfigurationTab;
