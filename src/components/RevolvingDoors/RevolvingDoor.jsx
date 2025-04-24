import React from "react";
import'./RevolvingDoor.css'
import { useDispatch, useSelector } from "react-redux";
import { setisRevolvingDoorHighlighted } from "../../slices/shelfDetailSlice";

const RevolvingDoor = ({doorKey,type,position,width,section, height}) => {
  
 const dispatch = useDispatch();
 const color = useSelector((state)=>state.shelfDetail.racks.execution.color);
 const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);
 const isRevDoorSelected = useSelector((state)=>state.shelfDetail.isRevolvingDoorHighlighted);
 const hideDoor = useSelector((state) => state.shelfDetail.hideDoor);

  const handleDoorClick = (e,id) =>{
    dispatch(setisRevolvingDoorHighlighted({
      id,
      position,
      type,
      height:height
    }))
    
  }

  return (
    <button
      className={`Deuren_Deuren__YKK11 Section_deuren__mXI7h ${color == 'black' ? "door_black":""} ${type}_${width} Deuren_clickable__7t+am
      ${isRevDoorSelected?.id == doorKey && section == selectedSection ? "isHighlighted":""} ${hideDoor ? "opacity-20 !pointer-events-none" : ""}`}
      style={{zIndex: "12",top: `${position}em`}}
      key={doorKey}
      onClick={(e)=>handleDoorClick(e,doorKey)}
    >
      <div className="Deuren_inner__dJXD6">
        <div className="Deuren_container__Pk33j">
          {/* <span className="ssdf">
            {doorKey}
          </span> */}
        </div>
      </div>
    </button>
  );
};

export default RevolvingDoor;
