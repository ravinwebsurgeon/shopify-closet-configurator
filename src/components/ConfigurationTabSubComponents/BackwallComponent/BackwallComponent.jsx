import React, { useState } from "react";
import './BackwallComponent.css'
import backPerfo from '../../../assets/back-perfo.png';
import backSolid from '../../../assets/back-solid.png';
import { setCurrBackwall, setEditingBackwall } from "../../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";


const BackwallComponent = () => {

  const dispatch = useDispatch();
  const [backwall,setBackwall] = useState(null);
  const editing = useSelector((state)=>state.shelfDetail.racks.isEditingBackwall);
  
  const cardData = [
    { id: "perfo", imgSrc: backPerfo, label: "BackWall Perfo" },
    { id: "closed", imgSrc: backSolid, label: "Backwall Closed " },
  ];

    const handleCardClick =  (e,id) =>{
        e.preventDefault();
        setBackwall(id);
        if(!editing){
            dispatch(setEditingBackwall(true));
        }
        if( id != backwall ){
          dispatch(setCurrBackwall(id));
        }
    }

  return (
    <div className="side-data-conatiner">
      {cardData.map((data, index) => (
        <div
          key={data.id}
          className={`side-data-card
              ${data.id === backwall ? "selected" : ""}
            `}
          onClick={(e) => handleCardClick(e, data.id)}
        >
          <div className="side-img">
            <img className="side-image" src={data.imgSrc} alt="shelf_image" />
          </div>
          <div className="side-detail-div">
            <span className="side-label">{data.label}</span>
            <span className="side-dimensions">83 X 30 cm</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BackwallComponent;
