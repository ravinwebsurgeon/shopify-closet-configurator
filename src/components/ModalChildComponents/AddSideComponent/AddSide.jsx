import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSideWall } from '../../../slices/shelfDetailSlice'

const AddSide = ({onClose,side}) => {

    const dispatch = useDispatch();

    const height = useSelector((state)=>state.shelfDetail.options.height);
    const currSection = useSelector((state) => state.shelfDetail.racks.selectedSection);
    const currHeight = useSelector((state)=>state.shelfDetail.racks.sections[currSection].height);
    const currType = useSelector((state)=>state.shelfDetail.selectedSideWall)
    const heightOptions = [50,...height]
    const [selectedHeight,setSelectedHeight] = useState(null);

    const handleSelectedHeight = (e,height) =>{
        e.preventDefault();
        setSelectedHeight(height)
    }

    const handleAddSideClick = (e) =>{
        e.preventDefault();
        console.log("side-->",side);
        console.log("selected height-->",selectedHeight);
        dispatch(updateSideWall({ sectionId:currSection, side, type:currType, height:selectedHeight }));
    }


  return (
    <>
      <div className="header-div border-b border-[#c2c2c2]">
        <h2 className='text-base !mb-0'>Wil je doorgaan met deze wijziging?</h2>
        <button className="add-section-close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
        <div className="data-container-div flex flex-col">
            <p className='text-base text-[#939393]'>Selecteer de gewenste hoogte van de zijwand. Het is na het selecteren mogelijk de zijwand naar de gewenste hoogte te verplaatsen.</p>
            <p className="text-base text-[#939393]">Bij het selecteren van een kleinere hoogte zijwand is het mogelijk meerdere wanden te stapelen.</p>
            <div className="radioBtn-container flex flex-wrap gap-4 mt-5">
                {heightOptions.map((height)=>(
                    <button className={`text-base border px-2 py-1 rounded-sm w-1/4
                    ${selectedHeight === height ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-700"}
                    ${height > currHeight ? "cursor-not-allowed bg-gray-200 opacity-50 pointer-events-none" : "hover:bg-gray-100"}
                    `} 
                    
                    disabled={height > currHeight}
                    key={height}  onClick={(e)=>handleSelectedHeight(e,height)}>
                        <span>{height} cm </span>
                    </button>
                ))} 
            </div>
            <div className="button-div mt-3">
                <button className="close-button" onClick={onClose}>
                Cancel
                </button>
                <button className="add-button" onClick={(e)=>handleAddSideClick(e)}>
                Apply
                </button>
            </div>
        </div>
     
    </>
  )
}

export default AddSide
