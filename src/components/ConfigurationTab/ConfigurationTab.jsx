import React, { useState } from "react";
import "./Configurationtab.css";
import DimensionsComponent from "../ConfigurationTabSubComponents/DimensionsComponent/DimensionsComponent";
import ExecutionComponent from "../ConfigurationTabSubComponents/ExecutionComponent/ExecutionComponent";
import ShelvesComponent from "../ConfigurationTabSubComponents/ShelvesComponent/ShelvesComponent";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab, setShowCounter } from "../../slices/shelfDetailSlice";
import SidesComponent from "../ConfigurationTabSubComponents/SidesComponent/SidesComponent";
import BackwallComponent from "../ConfigurationTabSubComponents/BackwallComponent/BackwallComponent";
import CompartmentsMain from "../Compartments/CompartmentsMain";
import RevolvingDoors from "../RevolvingDoors/RevolvingDoors";
import SlidingDoors from "../SlidingDoors/SlidingDoors";
import Drawers from "../Drawers/Drawers";
import WardrobeComponent from "../WardrobeComponent/WardrobeComponent";
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";


const ConfigurationTab = () => {
  const activeTab = useSelector((state) => state.shelfDetail.racks.activeTab);
  const details = useSelector((state) => state.shelfDetail);

  const dispatch = useDispatch();

  // const handleAddToCart = async() =>{

  //   const canvas = await html2canvas(document.getElementById("shelf-capture-area"));
  //   const imageData = canvas.toDataURL('image/png');
  //   saveAs(imageData,'shelf-design.png')
  // }

  const handleSectionClick = (sectionKey) => {
    dispatch(setActiveTab(sectionKey));
    if (sectionKey == "shelves") dispatch(setShowCounter(true));
  };
  const configTabs = [
    {
      id: "dimensions",
      label: "Afmetingen",
      component: <DimensionsComponent />,
    },
    { id: "execution", label: "Voeten", component: <ExecutionComponent /> },
    { id: "shelves", label: "Legborden", component: <ShelvesComponent /> },
    { id: "sides", label: "Zijwanden", component: <SidesComponent /> },
    {
      id: "backwalls",
      label: "Achterwanden",
      component: <BackwallComponent />,
    },
    {
      id: "compartments",
      label: "Vakverdeling",
      component: <CompartmentsMain />,
    },
    {
      id: "revolvingdoors",
      label: "Draaideuren",
      component: <RevolvingDoors />,
    },
    { id: "slidingdoors", label: "Schuifdeuren", component: <SlidingDoors /> },
    { id: "drawers", label: "Lades", component: <Drawers /> },
    {
      id: "wardroberods",
      label: "Garderobestangen",
      component: <WardrobeComponent />,
    },
  ];
  const selectedTab = configTabs.find((tab) => tab.id === activeTab);
  return (
    <div className="configuration-options max-w-[425px] w-full border border-[#E5E5E5] rounded-[10px] overflow-hidden">
      <div className="config-content px-[25px] py-[42px] h-[calc(100dvh-377px)] overflow-auto">
        <h2 className="text-black font-inter text-base mb-[21px] leading-[150%] tracking-[-2%] font-semibold">
          {selectedTab.label}
        </h2>
        {/* {renderTabContent()} */}
        {configTabs.find((tab) => tab.id === activeTab)?.component || (
          <p style={{ fontFamily: "Ubuntu" }}>Not yet available !!!</p>
        )}
      </div>
      <div className="px-[25px] py-5 bg-[#FCFCFC] border-t border-[#E5E5E5]">
        <h2 className="text-black font-inter text-base leading-[150%] tracking-[-2%] font-semibold">
          Extra opties
        </h2>

        <div className="config-tabs grid grid-cols-3 gap-[10px] mt-[11px]">
          {configTabs.map((tab) => (
            <button
              key={tab.id}
              className={`config-tab ${
                activeTab == tab.id ? "text-white bg-[#EB6200]" : "text-black"
              }
               font-inter text-xs leading-[150%] tracking-[-2%] font-semibold border py-[7px] border-[rgba(0,0,0,0.1)] rounded-[5px]
              `}
              onClick={() => handleSectionClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="leftsec-comp-3">
        <div className="left-comp3-row-container p-[25px] flex justify-between items-end border-t border-[#E5E5E5]">
          <button className="add-to-cart bg-[#EB6200] py-[7px] rounded-[5px] text-white font-inter text-xs tracking-[-2%] leading-[150%] font-semibold w-full max-w-[178px]">
            Afrekenen
          </button>

          <button className="total-price-container">
            <div className="total-price-col-container">
              <div className="total-price-row-conatiner">
                <span className="total-pricing font-inter text-base text-black block tracking-[-2%] leading-[150%] font-semibold text-right">
                  {calculateTotalPrice(details)}
                </span>
              </div>
              <span className="total-vat-text  font-inter text-xs text-black hidden tracking-[-2%] leading-[150%] font-medium text-right">
                Excluding VAT
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationTab;
