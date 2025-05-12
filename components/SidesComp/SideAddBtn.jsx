'use client';
import React, { useState } from "react";
import "./SideAddBtn.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import AddSide from "../ModalChildComponents/AddSideComponent/AddSide";
import { useDispatch, useSelector } from "react-redux";
import SideRemoveBtn from "../SideRemoveBtn/SideRemoveBtn";
import Modal from "../Shared/Modal/Modal";
import { setOpenModal, setSidewallSelected } from "../../slices/shelfDetailSlice";


const SideAddBtn = ({ height, width, prevKey, sideType, setisHighlighted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [side, setSide] = useState("");
  const dispatch = useDispatch();
  const currSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const leftSide = useSelector(
    (state) =>
      state.shelfDetail.racks.sections[currSection].sideWall["left"].isLeft
  );
  const leftPrevSide = useSelector(
    (state) =>
      state.shelfDetail.racks.sections[prevKey]?.sideWall["right"].isRight
  );
  const rightSide = useSelector(
    (state) =>
      state.shelfDetail.racks.sections[currSection].sideWall["right"].isRight
  );

  const handleLeftSideClick = (e) => {
    e.preventDefault();
    setSide("left");
    setIsModalOpen(true);
     dispatch(setSidewallSelected("left"));
     dispatch(setOpenModal(true));
  };

  const handleRightSideClick = (e) => {
    e.preventDefault();
    setSide("right");
    setIsModalOpen(true);
     dispatch(setSidewallSelected("right"));
     dispatch(setOpenModal(true));
  };
  return (
    <>
      <div
        className={`Section_sectionOverflow Section_width${width} Section_height${height} sideType__${sideType}`}
      >
        {!leftSide && !leftPrevSide && sideType == 'left' ? (
          <button
            type="button"
            className="AddRemove_button arrow_cstm leftArrow Section_removeAccessoireButtonLeft"
            style={{ top: height > 300 ? "-87em":"25em", left: height>300? "-74px" :"-62px" }}
            onClick={(e) => handleLeftSideClick(e)}
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
        ) : (
          sideType == 'left' &&   <SideRemoveBtn ll={prevKey} setisHighlighted={setisHighlighted} cc={currSection} leftPrevSide={leftPrevSide} leftSide={leftSide} sectionKey={leftPrevSide && prevKey ? prevKey : currSection}/>
        )}

        {!rightSide && sideType  == 'right' ? (
          <button
            type="button"
            className="AddRemove_button arrow_cstm rightArrow Section_removeAccessoireButton"
            style={{ top: height > 300 ? "-87em":"25em", right: "-14px" }}
            onClick={(e) => handleRightSideClick(e)}
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
        ) : (
        sideType  == 'right' &&  <SideRemoveBtn  leftPrevSide={leftPrevSide} setisHighlighted={setisHighlighted} leftSide={false} sectionKey={leftPrevSide && prevKey ? prevKey : currSection}/>
        )}
      </div>
    </>
  );
};

export default SideAddBtn;
