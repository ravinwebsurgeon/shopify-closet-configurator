import React from "react";
import "./SideRemoveBtn.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteSideWall, setEditingSides } from "../../slices/shelfDetailSlice";

const SideRemoveBtn = ({
  leftSide,
  sectionKey,
  leftPrevSide,
  setisHighlighted,
}) => {
  const dispatch = useDispatch();
  const sectionId = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const side = leftSide ? "left" : leftPrevSide ? "right" : "right";

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSideWall({ sectionId: sectionKey, side }));
    setisHighlighted({ left: "", right: "" });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    dispatch(setEditingSides(false));
    setisHighlighted({ left: "", right: "" });
  };

  return (
    <div
      className={`Section_removeConfirmAccessoireButton AddRemove_doubleButton sideRemoveBtn ${
        leftSide || leftPrevSide ? "left-enabled" : "rightArrow"
      }`}
      style={{ top: `${top}` }}
    >
      <button
        type="button"
        className={`AddRemove_buttonHalf`}
        onClick={(e) => handleDelete(e)}
      >
        <i
          className="Icon_container AddRemove_icon AddRemove_trashIcon"
          style={{ width: "14px", height: "16px" }}
        >
          <svg viewBox="0 0 14 16">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M11 6a1 1 0 01.993.883L12 7v8a1 1 0 01-.883.993L11 16H3a1 1 0 01-.993-.883L2 15V7a1 1 0 011.993-.117L4 7v7h6V7a1 1 0 01.883-.993L11 6zM7 0c.513 0 .936.483.993 1.104L8 1.25V3h5a1 1 0 010 2H1a1 1 0 110-2h5V1.25C6 .56 6.448 0 7 0z"
            ></path>
          </svg>
        </i>
      </button>

      <button
        type="button"
        className="AddRemove_buttonHalf"
        onClick={(e) => handleConfirm(e)}
      >
        <i
          className="Icon_container AddRemove_icon AddRemove_checkIcon"
          style={{ width: "16px", height: "16px" }}
        >
          <svg viewBox="0 0 16 16">
            <path
              fill="currentColor"
              d="M12.368 4.199a1 1 0 011.318.107l.081.084c.383.397.372 1.03-.024 1.414l-6.03 5.83a1.02 1.02 0 01-.025.025l-.08.084a.995.995 0 01-.677.305l-.049.001-.05-.001a.992.992 0 01-.675-.305l-.081-.084a1.02 1.02 0 01-.024-.026L2.305 8.01a1.002 1.002 0 01-.025-1.414l.081-.084a1 1 0 011.318-.107l.096.081v.001L6.882 9.49l5.39-5.209z"
            ></path>
          </svg>
        </i>
      </button>
    </div>
  );
};

export default SideRemoveBtn;
