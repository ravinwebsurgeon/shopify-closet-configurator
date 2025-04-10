// src/components/FormField.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormInputField = ({
  number,
  icon,
  label,
  name,
  value,
  options,
  onChange,
  active
}) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleChange = (e) => {
    if(active){
    onChange(e);
    setIsFilled(e.target.value !== "");
    }
  };

  return (
    <div className="form-field">
      <div className={`field-content flex items-center justify-between gap-4 ${active ? '' : 'opacity-50'}`}>
        <label className="font-inter font-semibold leading-[150%] tracking-[-2%] text-base text-black">
          {label}
        </label>
        <div className="relative w-full max-w-[327px]">
        <select
          className="w-full  font-inter font-normal text-base text-black leading-[150%] tracking-[-2%] px-[19px] min-h-[35px] border rounded-[5px] border-[rgba(0,0,0,0.1)] appearance-none"
          name={name}
          value={value}
          disabled={!active}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Selecteer
          </option>
          {options.map((val) => (
            <option key={val} value={val}>
              {val} {name !== "shelfCount" ? "cm" : ""}
            </option>
          ))}
        </select>
        <svg
          width="13"
          height="6"
          viewBox="0 0 13 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 -translate-y-1/2 right-6"
        >
          <path d="M6.5 6L0.870835 0.749999L12.1292 0.75L6.5 6Z" fill="black" />
        </svg>
      </div>
      </div>
    </div>
  );
};

export default FormInputField;
