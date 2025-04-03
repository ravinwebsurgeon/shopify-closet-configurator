import React, { useState } from 'react';
import sidewallClosed from '../../../assets/sidewall.png';
import sidewallPerfo from '../../../assets/sidewall-perfo.png';
import './SidesComponent.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrSideWall, setEditingSides } from '../../../slices/shelfDetailSlice';
const SidesComponent = () => {

    const dispatch = useDispatch();
    const[sideWall, setSideWall] = useState('');
    const editing = useSelector((state)=>state.shelfDetail.racks.isEditingSides);
    const cardData = [
        {id:"perfo" , imgSrc:sidewallPerfo,label:"Sidewall Perfo"},
        {id:"closed" , imgSrc:sidewallClosed,label:"Sidewall Closed "}
    ]


    const handleCardClick = (e,wall) =>{
      console.log("wall",wall);
        e.preventDefault();
        setSideWall(wall);
        if(!editing){
          dispatch(setEditingSides(true))
        }
        if(wall != sideWall){
          dispatch(setCurrSideWall(wall));
        }
    }



  return (
    <div className='side-data-conatiner'>
        {cardData.map((data,index)=>(
            <div key={data.id} className={`side-data-card
              ${data.id ===  sideWall ? "selected" : ""}
            `} onClick={(e)=>handleCardClick(e,data.id)}>
            <div className="side-img">
              <img  className="side-image" src={data.imgSrc} alt="shelf_image" />
            </div>
            <div className="side-detail-div">
              <span className="side-label">
                {data.label}
              </span>
              <span className="side-dimensions">
                83 X 30 cm
              </span>
            </div>
          </div>
        ))}
    </div>
  )
}

export default SidesComponent
