import React, { useState } from "react";
import {
  faArrowsLeftRight,
  faArrowsUpDown,
  faArrowUpRightDots,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./ConfiguraionForm.css";
import FormInputField from "./FormInputField";
import { useDispatch, useSelector } from "react-redux";
import logo from '../../assets/pointing.png'
import { setConfiguration } from "../../slices/shelfDetailSlice";

const ConfigurationFrom = () => {

  const dispatch = useDispatch()
  const options = useSelector((state) => state.shelfDetail.options)

  const [formData, setFormData] = useState({
    height: "",
    width: "",
    depth: "",
    shelfCount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only proceed if all fields are filled
    if (Object.values(formData).every((value) => value !== "")) {
      // action is dispatch to reducer and reducer updates the state
      dispatch(setConfiguration({
        height: parseInt(formData.height),
        width: parseInt(formData.width),
        depth: parseInt(formData.depth),
        shelfCount: parseInt(formData.shelfCount),
      }));
     
    }
  };

  return (
    <>
    <img className="pointing-man" src={logo}/>
    <div className="configurator-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="title">
          <h1>Build your shelving</h1>
        </div>
        <div className="form-fields">
          <FormInputField
              number="1"
              icon={faArrowsUpDown}
              label="Height"
              name="height"
              value={formData.height}
              options={options.height}
              onChange={handleChange}
            />

            <FormInputField
              number="2"
              icon={faArrowsLeftRight}
              label="Width"
              name="width"
              value={formData.width}
              options={options.width}
              onChange={handleChange}
            />

            <FormInputField
              number="3"
              icon={faArrowUpRightDots}
              label="Depth"
              name="depth"
              value={formData.depth}
              options={options.depth}
              onChange={handleChange}
            />

            <FormInputField
              number="4"
              icon={faLayerGroup}
              label="Shelves"
              name="shelfCount"
              value={formData.shelfCount}
              options={options.shelfCount}
              onChange={handleChange}
            />

        </div>
        <button type="submit" className="submit-button">
          Configure Shelving
        </button>
      </form>
    </div>
    </>
  );
};

export default ConfigurationFrom;
