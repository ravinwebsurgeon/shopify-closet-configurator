import React from "react";

const IconInfo = ({ className }) => {
  return (
    <svg viewBox="0 0 20 20" className={`${className || ""}`}>
      <path
        fillRule="evenodd"
        d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 2a8 8 0 100 16 8 8 0 000-16zm0 6a1 1 0 011 1v5a1 1 0 01-2 0V9a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2z"
      ></path>
    </svg>
  );
};

export default IconInfo;
