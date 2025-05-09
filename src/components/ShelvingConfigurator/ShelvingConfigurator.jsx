import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import "./ShelvingConfigurator.css";
import ConfigurationTab from "../ConfigurationTab/ConfigurationTab";
import ImageConfigurator from "../ImageConfigurator/ImageConfigurator";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDefault } from "../../slices/shelfDetailSlice";

const ShelvingConfigurator = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const term = searchParams.get("data");
  const defaultData = searchParams.get("default");
  if (term) {
    const parsedData = JSON.parse(term);
    dispatch(setDefault(parsedData?.data));
  }
  if (defaultData) {
    console.log(defaultData);
  }
  return (
    <>
      <div className="configurator-main-container py-5 flex px-[25px] pl-[99px] max-dex-sm:p-5 max-tab-xl:flex-col">
        <div className="configurator-right-section flex-1">
          <ImageConfigurator />
        </div>
        <ConfigurationTab />
      </div>
    </>
  );
};

export default ShelvingConfigurator;
