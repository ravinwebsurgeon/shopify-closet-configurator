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

import SlidingDoors from "../SlidingDoors/SlidingDoors";
import Drawers from "../Drawers/Drawers";
import WardrobeComponent from "../WardrobeComponent/WardrobeComponent";
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";
import { generateBOM } from "../../utils/generateBOM";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Shared/Modal/Modal";
import BOM from "../ModalChildComponents/BOMComponent/BOM";
import {
  setWoodActiveTab,
  setWoodShowCounter,
} from "../../slices/WoodShelfDetailSlice";
import SustainComponent from "../ConfigurationTabSubComponents/SustainComponent/SustainComponent";
import TopCapsComponent from "../ConfigurationTabSubComponents/TopCapsComponent/TopCapsComponent";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import axios from "axios";
import { getFormattedPrice } from "../../utils/getFormattedPrice";
import { toast } from "react-toastify";

const ConfigurationTab = () => {
  const [loading, setLoading] = useState(false);
  const metalRacks = useSelector((state) => state.shelfDetail.racks);
  const woodRacks = useSelector((state) => state.woodShelfDetail.racks);
  const metalShelfDetail = useSelector((state) => state.shelfDetail);
  const woodShelfDetail = useSelector((state) => state.woodShelfDetail);
  const priceData = metalShelfDetail?.priceData;
  const material = metalRacks?.execution?.material;
  const activeTab =
    material == "metal" ? metalRacks?.activeTab : woodRacks?.activeTab;
  const details = material == "metal" ? metalShelfDetail : woodShelfDetail;
  let format = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bomData, setBomData] = useState("");

  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const elementToHide = document.getElementById("exclude-this");
      if (elementToHide) {
        elementToHide.style.display = "none";
      }
      const canvas = await html2canvas(
        document.getElementById("shelf-capture-area")
      );

      const imageData = canvas.toDataURL("image/png");
      elementToHide.style.display = "block";

      const totalPrice = calculateTotalPrice(details, priceData,format=false);

      // product data object 
      const productData = {
        title: `Custom Shelf Configuration`,
        price:totalPrice,
        metafields: {
          customData: metalRacks,
          lineItems: generateBOM(details, priceData,format=false),
        },
        image: imageData,
      };
     // console.log("PRODUCT DATA -->",productData)
      //API call
      const response = await axios.post(
        "https://shopify-closet-configurator-backend.vercel.app/api/products/create",
        productData
      );
      if (response.status == 200) {
        window.parent.postMessage(
          { action: "addToCart", productData: response?.data?.product },
          "*"
        );
        toast.success("product successfully added to cart", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          className: "!font-inter !text-[13px] ",
        });
      }
     // saveAs(imageData,'shelf-design.png')
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        className: "!font-inter !text-[13px] ",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (sectionKey) => {
    if (material == "metal") {
      dispatch(setActiveTab(sectionKey));
    } else {
      dispatch(setWoodActiveTab(sectionKey));
    }

    if (sectionKey == "shelves") {
      if (material == "metal") {
        dispatch(setShowCounter(true));
      } else {
        dispatch(setWoodShowCounter(true));
      }
    }
  };

  const handleInfoClick = () => {
    setIsModalOpen(true);
    const data = generateBOM(details, priceData);
    setBomData(data);
  };

  const configTabs = [
    {
      id: "dimensions",
      label: "Afmetingen",
      component: <DimensionsComponent />,
    },
    { id: "execution", label: "Voeten", component: <ExecutionComponent /> },
    { id: "Sustain", label: "Schoren", component: <SustainComponent /> },
    { id: "TopCaps", label: "Topdoppen", component: <TopCapsComponent /> },
    // { id: "shelves", label: "Legborden", component: <ShelvesComponent /> },
    { id: "sides", label: "Zijwanden", component: <SidesComponent /> },
    // { id: "backwalls", label: "Achterwanden", component: <BackwallComponent /> },
    {
      id: "compartments",
      label: "Vakverdeling",
      component: <CompartmentsMain />,
    },
    // { id: "revolvingdoors", label: "Draaideuren",component: <RevolvingDoors /> },
    // { id: "slidingdoors", label: "Schuifdeuren", component: <SlidingDoors /> },
    // { id: "drawers", label: "Lades", component: <Drawers /> },
    {
      id: "wardroberods",
      label: "Garderobestangen",
      component: <WardrobeComponent />,
    },
  ];
  const selectedTab = configTabs.find((tab) => tab.id === activeTab);
  return (
    <>
      <div className="flex flex-col max-w-[425px] max-tab-xl:max-w-full">
        <div className="configuration-options max-w-[425px] w-full border border-[#E5E5E5] rounded-[10px] overflow-hidden max-tab-xl:max-w-full">
          <div className="config-content px-[25px] py-[42px] h-[calc(100dvh-520px)] overflow-auto max-tab-sm:p-4">
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

            <div className="config-tabs grid grid-cols-2 gap-[10px] mt-[11px]">
              {configTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`config-tab ${
                    activeTab == tab.id
                      ? "text-white bg-[#EB6200]"
                      : "text-black"
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
              <button
                className="add-to-cart bg-[#EB6200] py-[7px] rounded-[5px] text-white font-inter text-xs tracking-[-2%] leading-[150%] font-semibold w-full max-w-[178px]"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="opacity-0">Afrekenen</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  "Afrekenen"
                )}
              </button>

              <button className="total-price-container">
                <div className="total-price-col-container">
                  <div className="total-price-row-conatiner flex gap-2 items-center">
                    <span className="total-pricing font-inter text-base text-black block tracking-[-2%] leading-[150%] font-semibold text-right">
                      {calculateTotalPrice(details, priceData)}
                    </span>
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      onClick={handleInfoClick}
                    />
                  </div>
                  <span className="total-vat-text  font-inter text-xs text-black hidden tracking-[-2%] leading-[150%] font-medium text-right">
                    Excluding VAT
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className=" flex flex-col bg-[#0665C5] text-[#fff] mt-[20px] py-[25px] px-[25px]">
          <span className=" font-inter text-[16px] tracking-[-2%] leading-[150%] font-semibold">
            Heeft u een vraag over uw samenstelling?
          </span>
          <span className="font-inter font-light tracking-[-2%] leading-[150%] text-[14px] mt-[5px]">
            Neem dan contact met ons op via info@bedrijfsinrichtingnederland.nl
            en wij zullen uw vraag zo snel mogelijk behandelen.
          </span>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          mainHeading={"Prijsoverzicht"}
          closeModal={() => setIsModalOpen((prev) => !prev)}
        >
          <BOM
            data={bomData}
            totalPrice={calculateTotalPrice(details, priceData)}
          />
        </Modal>
      )}
    </>
  );
};

export default ConfigurationTab;
