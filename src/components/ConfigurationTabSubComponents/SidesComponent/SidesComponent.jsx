import React, { useState } from 'react';
import sidewallClosed from '../../../assets/sidewall.png';
import sidewallPerfo from '../../../assets/sidewall-perfo.png';
import './SidesComponent.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrSideWall, setEditingSides } from '../../../slices/shelfDetailSlice';
import getComponentPrice from '../../../utils/getPrice';


const SidesComponent = () => {

    const dispatch = useDispatch();
    const[sideWall, setSideWall] = useState('');
    const editing = useSelector((state)=>state.shelfDetail.racks.isEditingSides);
    const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);
    const height = useSelector((state)=>state.shelfDetail.racks.sections[selectedSection].height);
    const depth = useSelector((state)=>state.shelfDetail.racks.depth);
    const color = useSelector((state)=>state.shelfDetail.racks.execution.color);

    const cardData = [
        {id:"perfo" , imgSrc:sidewallPerfo,label:"Sidewall Perfo"},
        {id:"closed" , imgSrc:sidewallClosed,label:"Sidewall Closed "}
    ]


    const handleCardClick = (e,wall) =>{
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
        {cardData.map((data,index)=>{

          const price = getComponentPrice({
            material: color,
            component:'sidewall',
            subtype: data.id,
            height,
            depth
          })

            return(
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
                  {`${height} x ${depth} cm`}
                </span>
                <span className="side-price text-[#5c5c5c]">
                   {price}
                </span>
              </div>
            </div>
            );
            
        })}
    </div>
  )
}

export default SidesComponent
