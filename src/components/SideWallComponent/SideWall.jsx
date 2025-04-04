import React from "react";

const SideWall = ({type,height}) => {

  return (
    <div className="stander-side-wall"   style={{position:"absolute"}}>
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
    </div>
  );
};

export default SideWall;
