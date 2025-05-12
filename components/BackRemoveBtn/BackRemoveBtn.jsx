'use client';
import React, { useState } from 'react'
import './BackRemoveBtn.css'
import { useDispatch } from 'react-redux'
import { deleteBackwall, setEditingBackwall } from '../../slices/shelfDetailSlice';
const BackRemoveBtn = ({width ,id}) => {

    const dispatch = useDispatch();

    const handleDelete = (e) =>{
        e.preventDefault();
        dispatch(deleteBackwall({sectionId:id}));
    }

    const handleConfirm = (e) =>{
        e.preventDefault();
        dispatch(setEditingBackwall(false));
    }

  console.log("top---3>", top);
  return (
    <div
      className={`Section_removeConfirmAccessoireButton AddRemove_doubleButton sideRemoveBtn `}
      style={{ top: `${top}`,left:` ${width}px` } }
    >
        <button
        type="button"
        className={`AddRemove_buttonHalf`}
        onClick={(e)=>handleDelete(e)}
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

      <button type="button" className="AddRemove_buttonHalf" onClick={(e)=>handleConfirm(e)}>
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
  )
}

export default BackRemoveBtn
