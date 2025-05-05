import React from "react";
import WidthIcon from "../../assets/Breadth.svg";
import DepthIcon from "../../assets/Depth.svg";
import EditIcon from "../../assets/Edit.svg";
import HeightIcon from "../../assets/Height.svg";

const DimensionVisualizer = ({ height, width, depth }) => {
  return (
    <div id="exclude-this" className=" absolute bottom-[58px] max-tab-xl:left-1/2 max-tab-xl:-translate-x-1/2 max-tab-xl:w-full max-tab-xl:px-5">
      <div className=" dimension-visualizer  bottom-[58px]  border border-[#E5E5E5] h-[68px]  flex  max-tab-xl:gap-2 max-tab-xl:flex-wrap max-tab-xl:border-0 max-tab-xl:justify-center">
        <div className="w-[151px] border-r border-[#E5E5E5] h-[68px] flex items-center justify-center max-tab-xl:flex-1 max-tab-xl:border-1  max-tab-xl:border-[#E5E5E5]">
          <div className="flex items-center gap-[10px]">
            <div className="h-[38px] w-[38px] bg-[#F5F5F5] rounded flex items-center justify-center">
              <img src={EditIcon} alt="" />
            </div>
            <span className="font-inter font-medium text-[12px] leading-none tracking-[0%]">
              Afmetingen
            </span>
          </div>
        </div>
        {/*  Height div */}
        <div className="w-[151px] h-[68px] flex items-center justify-center max-tab-xl:flex-1  max-tab-xl:border-1 max-tab-xl:border-[#E5E5E5]">
          <div className="flex items-center gap-[10px]">
            <div className=" flex items-center justify-center">
              <img src={HeightIcon} alt="Hoogte" />
            </div>
            <span className="font-inter font-medium text-[12px] leading-none tracking-[0%]">
              Hoogte:
            </span>
            <div className="font-inter font-medium text-[10px] bg-[#0665C5] text-[#fff] rounded-[5px] py-[8px] px-[10px]">
              {`${height} cm`}
            </div>
          </div>
        </div>
        {/* Width */}
        <div className="w-[151px]  h-[68px] flex items-center justify-center max-tab-xl:flex-1 max-tab-xl:border-1 max-tab-xl:border-[#E5E5E5] ">
          <div className="flex items-center gap-[10px]">
            <div className=" flex items-center justify-center">
              <img src={WidthIcon} alt="Breedte" />
            </div>
            <span className="font-inter font-medium text-[12px] leading-none tracking-[0%]">
              Breedte:
            </span>
            <div className="font-inter font-medium text-[10px] bg-[#0665C5] text-[#fff] rounded-[5px] py-[8px] px-[10px]">
              {`${width} cm`}
            </div>
          </div>
        </div>
        {/* Depth */}
        <div className="w-[151px]  h-[68px] flex items-center justify-center max-tab-xl:flex-1 max-tab-xl:border-1 max-tab-xl:border-[#E5E5E5]">
          <div className="flex items-center gap-[10px]">
            <div className=" flex items-center justify-center">
              <img src={DepthIcon} alt="Diepte" />
            </div>
            <span className="font-inter font-medium text-[12px] leading-none tracking-[0%]">
              Diepte:
            </span>
            <div className="font-inter font-medium text-[10px] bg-[#0665C5] text-[#fff] rounded-[5px] py-[8px] px-[10px]">
              {`${depth} cm`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionVisualizer;
