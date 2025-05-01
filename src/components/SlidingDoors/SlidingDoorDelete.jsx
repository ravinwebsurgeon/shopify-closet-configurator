import React from 'react'
import DeleteAndConfirm from '../DeleteAndConfirm/DeleteAndConfirm'
import { useDispatch, useSelector } from 'react-redux'
import {  removeSlidingDoor, setSlidingDoorHighlighted } from '../../slices/shelfDetailSlice';


const SlidingDoorDelete = ({section,door}) => {

    const dispatch = useDispatch();
    const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);

    const deleteRevDoor = ({sectionId,doorKey})=>{
        dispatch(removeSlidingDoor({
            sectionId,
            doorKey
        }));

        dispatch(setSlidingDoorHighlighted(false));
    }

    const closeRevDoor = () =>{
        dispatch(setSlidingDoorHighlighted(false));
    }

  return (
    <DeleteAndConfirm
      top={`${door.position + 12.5}em`}
      onDelete={() => deleteRevDoor({sectionId:selectedSection,doorKey:door?.id})}
      onConfirm={closeRevDoor}
      section={section}
    />
  )
}

export default SlidingDoorDelete
