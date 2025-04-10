import React from "react";

const IconClose = ({ className }) => {
  return (
    <svg className={`${className || ""}`} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M7.722 6.295l4.277 4.278 4.28-4.278a1.008 1.008 0 011.426 1.427l-4.279 4.277 4.279 4.28a1.008 1.008 0 01-1.427 1.426L12 13.426l-4.277 4.279a1.008 1.008 0 01-1.427-1.427L10.573 12 6.295 7.722a1.008 1.008 0 011.427-1.427z"
      ></path>
    </svg>
  );
};

export default IconClose;
