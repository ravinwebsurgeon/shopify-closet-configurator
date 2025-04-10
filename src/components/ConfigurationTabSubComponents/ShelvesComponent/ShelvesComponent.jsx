import React, { useEffect, useState } from 'react'
import'./ShelvesComponent.css'

import legboard from '../../../assets/legbord-metal-55.png'
import legboardBlack from '../../../assets/legboard-black-55.png'
import { useDispatch, useSelector } from 'react-redux'
import { setShowCounter } from '../../../slices/shelfDetailSlice'
import getComponentPrice from '../../../utils/getPrice'

const ShelvesComponent = () => {
  
  const dispatch = useDispatch();
  const color = useSelector((state)=>state.shelfDetail.racks.execution.color);
   const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);
    const width = useSelector((state)=>state.shelfDetail.racks.sections[selectedSection].width);
    const depth = useSelector((state)=>state.shelfDetail.racks.depth);

  const cardData = [
    {id:"metal",imgSrc:legboard,label:"Shelf with support"},
    {id:"black",imgSrc:legboardBlack,label:"Shelf with support (black)"},
  ]
  
  const getData =(color)=>{
    return cardData.find((data) => data.id === color)
  };

  const [inputData,setInputData] = useState(getData(color));

  useEffect(()=>{
    setInputData(getData(color))
  },[color]);


  const handleCardClick = (e) =>{
    e.preventDefault();
    dispatch(setShowCounter(true));
  };


  const price = getComponentPrice({
    material: color,
    component:'shelves',
    width,
    depth
  })

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
            {`${width-2} x ${depth} cm`}
          </span>
          <span className="shelf-price text-[#5c5c5c]">
            {`${price}`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ShelvesComponent
