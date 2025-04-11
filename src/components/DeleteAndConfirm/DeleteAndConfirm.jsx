import React from "react";

const DeleteAndConfirm = ({ onDelete, onConfirm, section, top }) => {
  if (!onDelete && !onConfirm) {
    return <div>Add Delete and Confirm to the component</div>;
  }
  return (
    <div
      className={`shelfRemoveBtnOver !h-full scale-90 shelfRemove_bottom${section?.height} shelfRemove_width${section?.width}`}
    >
      <div
        className="glb-remove-confirm rightArrow arrow_cstm"
        style={{ top: top }}
      >
        <button
          onClick={() => onDelete()}
          type="button"
          className="px-1.5 pt-[1px] w-full flex justify-center items-center"
        >
          <svg viewBox="0 0 14 16" className="fill-[#d60000] w-3.5 h-4">
            <path
              fill="#d60000"
              fillRule="evenodd"
              d="M11 6a1 1 0 01.993.883L12 7v8a1 1 0 01-.883.993L11 16H3a1 1 0 01-.993-.883L2 15V7a1 1 0 011.993-.117L4 7v7h6V7a1 1 0 01.883-.993L11 6zM7 0c.513 0 .936.483.993 1.104L8 1.25V3h5a1 1 0 010 2H1a1 1 0 110-2h5V1.25C6 .56 6.448 0 7 0z"
            ></path>
          </svg>
        </button>
        <button
          onClick={() => onConfirm()}
          type="button"
          className="px-1.5 pt-[1px]  w-full flex justify-center items-center"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4">
            <path
              fill="#3c9cea"
              d="M12.368 4.199a1 1 0 011.318.107l.081.084c.383.397.372 1.03-.024 1.414l-6.03 5.83a1.02 1.02 0 01-.025.025l-.08.084a.995.995 0 01-.677.305l-.049.001-.05-.001a.992.992 0 01-.675-.305l-.081-.084a1.02 1.02 0 01-.024-.026L2.305 8.01a1.002 1.002 0 01-.025-1.414l.081-.084a1 1 0 011.318-.107l.096.081v.001L6.882 9.49l5.39-5.209z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DeleteAndConfirm;
