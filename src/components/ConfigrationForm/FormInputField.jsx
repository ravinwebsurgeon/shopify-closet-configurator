// src/components/FormField.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormInputField = ({ number, icon, label, name, value, options, onChange }) => {

    const[isFilled,setIsFilled] = useState(false);

    const handleChange = (e) =>{
        onChange(e)
        setIsFilled(e.target.value !== "")
    }



  return (
    <div className="form-field">
      <div className={`field-number ${isFilled ? "selected" : ""} `}>{number}</div>
      <div className="field-content">
        <div className="field-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <label>{label}</label>
        <select name={name} value={value} onChange={handleChange} required>
          <option value="" disabled>
            Select
          </option>
          {options.map((val) => (
            <option key={val} value={val}>
              {val} {name !== "shelfCount" ? "cm" : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FormInputField;
