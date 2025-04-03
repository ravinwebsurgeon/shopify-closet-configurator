import React from "react";
import { useSelector } from "react-redux";

const SideWall = ({type,height}) => {

  return (
    <button className="stander-side-wall" onClick={()=>alert("button clicked")}>
        <div
        className={`Staander_Staander__rAo9j Staander_height${height}`}
        // style={{top: "100%", transform: "translateY(-100%)"}}
        >
        <div className={`Staander_side Staander_side_${type}`}>
            <div className="Staander_sideTop"></div>
            <div className="Staander_sideMiddle"></div>
            <div className="Staander_sideBottom"></div>
        </div>
        </div>
    </button>
  );
};

export default SideWall;
