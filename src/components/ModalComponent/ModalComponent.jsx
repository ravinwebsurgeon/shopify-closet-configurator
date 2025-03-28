import React from "react";
import "./ModalComponent.css";

const ModalComponent = ({ isOpen,children}) => {
  
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default ModalComponent;
