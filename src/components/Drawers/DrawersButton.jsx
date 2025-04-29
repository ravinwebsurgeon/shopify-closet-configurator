import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDrawerHighlighted } from "../../slices/shelfDetailSlice";
const DrawersButton = ({ shelfkey, arr, index, shelf }) => {
  const dispatch = useDispatch();
  const highlightedDrawer = useSelector(
    (state) => state.shelfDetail.highlightedDrawer
  );
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  return (
    <div
      key={shelfkey}
      data-type="drawer"
      data-key={shelfkey}
      className={`Legbord_Legbord__Outer !absolute w-full Legbord__drawer`}
      style={{
        zIndex: arr.length - index,
        top: shelf?.drawer.position.top,
      }}
    >
      <button
        className={`lade_inner ${
          highlightedDrawer?.shelfkey === shelfkey ? "isHighlighted" : ""
        } 
        ${color == "black" ? "lade_black" : ""}`}
        onClick={() =>
          dispatch(
            setDrawerHighlighted({
              shelfkey,
              top: shelf?.drawer.position.top,
            })
          )
        }
      >
        {/* <span className="ssdf">
          {shelfkey}
        </span> */}
        <div className="lade_leff"></div>
        <div className="lade_middle"></div>
        <div className="lade_right"></div>
      </button>
    </div>
  );
};

export default DrawersButton;
