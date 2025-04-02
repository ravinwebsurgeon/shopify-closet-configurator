import React from 'react';
import sidewallClosed from '../../../assets/sidewall.png';
import sidewallPerfo from '../../../assets/sidewall-perfo.png';
import './SidesComponent.css';
import { useDispatch } from 'react-redux';
import { setEditingSides } from '../../../slices/shelfDetailSlice';
const SidesComponent = () => {

    const dispatch = useDispatch();
    const cardData = [
        {id:"closed" , imgSrc:sidewallPerfo,label:"Sidewall Perfo"},
        {id:"closed" , imgSrc:sidewallClosed,label:"Sidewall Closed "}
    ]


    const handleCardClick = (e) =>{
        e.preventDefault();
        dispatch(setEditingSides(true))
    }



  return (
    <div className='side-data-conatiner'>
        {cardData.map((data,index)=>(
            <div key={index} className="side-data-card" onClick={(e)=>handleCardClick(e)}>
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
