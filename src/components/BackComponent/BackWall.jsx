import React, { useState } from "react";
import "./Backwall.css";
import { useDispatch } from "react-redux";
import { setCurrSelectedSection, setEditingBackwall } from "../../slices/shelfDetailSlice";
const BackWall = ({type,height,id,selectedSectionBackWall , selectedSection, setSelectedSection, setBackWallSelectedSection}) => {

    const dispatch = useDispatch();
    
    const highlighted = selectedSectionBackWall == id;

    const handleBackwallClick = (e) =>{
        e.preventDefault();
        setSelectedSection(id);
        setBackWallSelectedSection(id)
        dispatch(setCurrSelectedSection(id));
        dispatch(setEditingBackwall(true));

    }

  return (
    <button className={`Section_removeButtonStyles`} onClick={(e)=>handleBackwallClick(e)}>
      <div
        className={`Section_wall Section_achterwand ${type == 'perfo' ?'Section_wallperfo': ''}
        ${highlighted ? "Section_isHighlighted": ""}
         Section_height${height} `}
        style={{top: "calc(100% - 24px)", transform: "translateY(-100%)"}}
      >
        <div className="Section_wallLeft"></div>
        <div className="Section_wallMiddle"></div>
        <div className="Section_wallRight"></div>
      </div>
    </button>
  );
};

export default BackWall;
