import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import './ShelfCounter.css'
import { useDispatch, useSelector } from 'react-redux';
const ShelfCounter = () => {
    const dispatch = useDispatch();
    const racksData = useSelector((state)=>state.shelfDetail.racks);
    const currentSection = racksData.selectedSection;
    const [shelfCount,setShelfCount] = useState(3);


    const handleAddShelf = (e) =>{
        e.preventDefault();
        setShelfCount((prevData) => prevData + 1);
    }

    const handleRemoveShelf = (e) =>{
        e.preventDefault();
        setShelfCount((prevData)=>prevData-1);
    }


  return (
    <>
      <div class="CounterWithAddRemove_container">
      <div class="CounterWithAddRemove_counter">
        <button className="shelf-decreament-btn" disabled={shelfCount === 3} onClick={handleRemoveShelf}> <FontAwesomeIcon icon={faMinus} /> </button>
        <span className='shelf-counter'>{shelfCount}</span>
        <button className='shelf-increament-btn' onClick={handleAddShelf}> <FontAwesomeIcon icon={faPlus} /> </button>
      </div>
      <div className='shelf-confirm-btn-div'>
        <button className='shelf-confirm-btn'><FontAwesomeIcon icon={faCheck} /></button>
      </div>
      </div>
    </>
  )
}

export default ShelfCounter
