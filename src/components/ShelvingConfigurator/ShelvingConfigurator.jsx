import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./ShelvingConfigurator.css";
import ConfigurationTab from "../ConfigurationTab/ConfigurationTab";
import ImageConfigurator from "../ImageConfigurator/ImageConfigurator";

const ShelvingConfigurator = () => {
  return (
    <>
      <div className="configurator-main-container py-5 flex px-[25px]">
        <div className="configurator-right-section flex-1">
          <ImageConfigurator />
        </div>
        <ConfigurationTab />
      </div>
    </>
  );
};

export default ShelvingConfigurator;
