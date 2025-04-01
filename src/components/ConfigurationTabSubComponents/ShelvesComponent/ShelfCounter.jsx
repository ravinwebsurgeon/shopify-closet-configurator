import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import './ShelfCounter.css'
import { useDispatch, useSelector } from 'react-redux';
import { updateShelvesPosition } from '../../../slices/shelfDetailSlice';
const ShelfCounter = ({onClick}) => {
    const dispatch = useDispatch();
    let positionArray = [];

    const sectionData = useSelector((state)=>state.shelfDetail.racks.sections);
    const sectionId = useSelector((state)=>state.shelfDetail.racks.selectedSection);
    const currentSection = sectionData[sectionId];
    console.log("current_section",currentSection);
    const shelf_count = currentSection ?Object.keys(currentSection.shelves).length :25;
    const shelfHeight = currentSection["height"]
    console.log("shelf-count",shelf_count)
    const [shelfCount,setShelfCount] = useState(shelf_count);

    const heightArr = [
        {"100":"57"},
        {"120":"67"},
        {"150":"82"},
        {"180":"97"},
        {"200":"107"},
        {"210":"112"},
        {"220":"117"},
        {"240":"127"},
        {"250":"132"},
        {"300":"157"},
      ]

      // function used to set shelves at a specific height
  const  GeneratePosArr = (currShelfHeight, shelfCount)=>{
    const Result = heightArr.find(obj => obj[currShelfHeight] !== undefined)
    const heightResult = parseInt(Object.values(Result)[0])
    
    const positions =[];
    
    for (let i = 0; i < shelfCount; i++) {
      const topPosition = ((heightResult - 9.5)/(shelfCount-1))*i
      positions.push({
        zIndex:shelfCount-i,
        top:`${topPosition}em`
      })
    }
    return positions;
  }

  useEffect(() => {
    console.log("Updated shelf count:", shelfCount);
    console.log("Position array", GeneratePosArr(shelfHeight, shelfCount));
    positionArray = GeneratePosArr(shelfHeight, shelfCount);
    dispatch(updateShelvesPosition({sectionId,positionArray}));
}, [shelfCount]);

    const handleAddShelf = (e) =>{
        e.preventDefault();
        setShelfCount((prevData) => prevData + 1);
        
    }

    const handleRemoveShelf = (e) =>{
        e.preventDefault();
        setShelfCount((prevData)=>prevData-1);
        console.log("position arrray",GeneratePosArr(shelfHeight,shelfCount));
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
        <button className='shelf-confirm-btn' onClick={onClick}><FontAwesomeIcon icon={faCheck} /></button>
      </div>
      </div>
    </>
  )
}

export default ShelfCounter
