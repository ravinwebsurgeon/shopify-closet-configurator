import React, { useState } from "react";
import'./SideAddBtn.css'
import ModalComponent from "../ModalComponent/ModalComponent";
import AddSide from "../ModalChildComponents/AddSideComponent/AddSide";

const SideAddBtn = ({height,width}) => {

    const [isModalOpen,setIsModalOpen] = useState(false);
    const [side,setSide] = useState('');



    const handleLeftSideClick = (e) =>{
        e.preventDefault();
        setIsModalOpen(true);
        setSide("left");
    }

    const handleRightSideClick = (e) =>{
      e.preventDefault();
      setIsModalOpen(true);
      setSide("right");
  }



  return (
    <>
    <div className={`Section_sectionOverflow Section_width${width} Section_height${height}`}>
      <button
        type="button"
        className="AddRemove_button Section_removeAccessoireButtonLeft"
        style={{ top: "25em", left: "-62px" }}
        onClick={(e)=>handleLeftSideClick(e)}
      >
        <i
          className="Icon_container AddRemove_icon"
          style={{ width: "16px", height: "16px" }}
        >
          <svg viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M8 0a1 1 0 011 1v6h6a1 1 0 010 2H9v6a1 1 0 01-2 0V9H1a1 1 0 110-2h6V1a1 1 0 011-1z"
            ></path>
          </svg>
        </i>
      </button>
      <button
        type="button"
        className="AddRemove_button Section_removeAccessoireButton"
        style={{ top: "25em", right: "-14px" }}
        onClick={(e)=>handleRightSideClick(e)}
      >
        <i
          className="Icon_container AddRemove_icon"
          style={{ width: "16px", height: "16px" }}
        >
          <svg viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M8 0a1 1 0 011 1v6h6a1 1 0 010 2H9v6a1 1 0 01-2 0V9H1a1 1 0 110-2h6V1a1 1 0 011-1z"
            ></path>
          </svg>
        </i>
      </button>
    </div>
    <ModalComponent isOpen={isModalOpen}>
      <AddSide onClose={()=>setIsModalOpen(false)} side={side}/>
    </ModalComponent>
        
    </>
  );
};

export default SideAddBtn;
