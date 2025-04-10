import React, { useState } from "react";
import './BackwallComponent.css'
import backPerfo from '../../../assets/back-perfo.png';
import backSolid from '../../../assets/back-solid.png';
import { setCurrBackwall, setEditingBackwall } from "../../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import getComponentPrice from "../../../utils/getPrice";


const BackwallComponent = () => {

  const dispatch = useDispatch();
  const [backwall,setBackwall] = useState(null);
  const editing = useSelector((state)=>state.shelfDetail.racks.isEditingBackwall);
  const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);
  const width = useSelector((state)=>state.shelfDetail.racks.sections[selectedSection].width);
  const height = useSelector((state)=>state.shelfDetail.racks.sections[selectedSection].height);
  const color = useSelector((state)=>state.shelfDetail.racks.execution.color);

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
    <div className="back-data-conatiner">
      {width < 115 ? (
        cardData.map((data) => {

          const price = getComponentPrice({
            material: color,
            component:'backwall',
            subtype: data.id,
            height,
            width
          })

          return(
          <div
            key={data.id}
            className={`back-data-card ${data.id === backwall ? "selected" : ""}`}
            onClick={(e) => handleCardClick(e, data.id)}
          >
            <div className="back-img">
              <img className="back-image" src={data.imgSrc} alt="shelf_image" />
            </div>
            <div className="back-detail-div">
              <span className="back-label">{data.label}</span>
              <span className="back-dimensions">{`${height} x ${(width-2)} cm`}</span>
              <span className="back-price"> {price}</span>
            </div>
          </div>
        )})
      ) : (
        <div className="backwall-warning">
          <strong>No back walls available with this size</strong>
          <br/>
          <p>Back walls are only available with a width of:</p>
          <br/>
          <strong>55cm - 70cm - 85cm - 100cm</strong>

        </div>
      )}
    </div>
  );
};

export default BackwallComponent;
