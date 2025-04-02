import React, { useEffect, useState } from 'react'
import'./ShelvesComponent.css'

import legboard from '../../../assets/legbord-metal-55.png'
import legboardBlack from '../../../assets/legboard-black-55.png'
import { useDispatch, useSelector } from 'react-redux'
import { setShowCounter } from '../../../slices/shelfDetailSlice'


const ShelvesComponent = () => {
  
  const dispatch = useDispatch();
  const color = useSelector((state)=>state.shelfDetail.racks.execution.color);

  const cardData = [
    {id:"metal",imgSrc:legboard,label:"Shelf with support"},
    {id:"black",imgSrc:legboardBlack,label:"Shelf with support (black)"},
  ]
  
  const getData =(color)=>{
    return cardData.find((data) => data.id === color)
  };


  const [inputData,setInputData] = useState(getData(color))

  

  

  useEffect(()=>{
    setInputData(getData(color))
  },[color]);


  const handleCardClick = (e) =>{
    e.preventDefault();
    dispatch(setShowCounter(true));
  };



  return (
    <div className='shelf-data-conatiner'>
      <div className="shelf-data-card" onClick={(e)=>handleCardClick(e)}>
        <div className="shelf-img">
          <img  className="shelf-image" src={inputData.imgSrc} alt="shelf_image" />
        </div>
        <div className="shelf-detail-div">
          <span className="shelf-label">
            {inputData.label}
          </span>
          <span className="shelf-dimensions">
            83 X 30 cm
          </span>
        </div>
      </div>
    </div>
  )
}

export default ShelvesComponent
