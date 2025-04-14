import React, { useState } from "react";
import './WardrobeRods.css'

const WardrobeRods = ({shelfkey,top,index}) => {

    const currTop = parseFloat(top);
    const newTop = currTop+2+"em";

    const [isRodHighlighted,setIsRodHighlighted] = useState('');


  return (
    <button
      className={`Garderobe_Garderobe__cW0VR Section_garderobe__lck6- Garderobe_height50__7PHv0 Garderobe_metal__HYc6w Garderobe_black__m0wTQ Garderobe_clickable__dBOWm
        ${isRodHighlighted == shelfkey? "Garderobe_isHighlighted__3zo47":""}`}
      style={{zIndex: {index}, top: `${newTop}`}}
      onClick={()=>setIsRodHighlighted(shelfkey)}
      key={shelfkey}
    >
      <div className="Garderobe_inner__jbyRf">
        <div className="Garderobe_container__ogs9T">
          <div className="Garderobe_left__V1+UW"></div>
          <div className="Garderobe_middle__6jgqV">
            <div className="Garderobe_middleLeft__E+Xmp"></div>
            <div className="Garderobe_middleCenter__onkch"></div>
          </div>
          <div className="Garderobe_right__26GJ1"></div>
        </div>
        <div className="Garderobe_hangers__9XEB3">
          <div className="Garderobe_hanger__8lbx5"></div>
          <div className="Garderobe_hanger__8lbx5"></div>
        </div>
      </div>
    </button>
  );
};

export default WardrobeRods;
