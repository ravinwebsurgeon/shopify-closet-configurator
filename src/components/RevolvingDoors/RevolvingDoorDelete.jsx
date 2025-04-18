import React from 'react'
import DeleteAndConfirm from '../DeleteAndConfirm/DeleteAndConfirm'
import { useDispatch, useSelector } from 'react-redux'
import { removeRevolvingDoor, setisRevolvingDoorHighlighted, storeDeletedRevDoor } from '../../slices/shelfDetailSlice';
import { height } from '@fortawesome/free-brands-svg-icons/fa42Group';

const RevolvingDoorDelete = ({section,door}) => {

    const dispatch = useDispatch();
    const selectedSection = useSelector((state)=>state.shelfDetail.racks.selectedSection);
    const sections = useSelector((state)=>state.shelfDetail.racks.sections);

    const deleteRevDoor = ({sectionId,doorKey})=>{
        dispatch(removeRevolvingDoor({
            sectionId,
            doorKey
        }));
        dispatch(storeDeletedRevDoor({
          sectionId,
          doorKey,
          position:sections[selectedSection].revolvingDoor[doorKey].position,
          height:Number((sections[selectedSection].revolvingDoor[doorKey].type).split("_")[3]),

        }))
        dispatch(setisRevolvingDoorHighlighted(false));
    }

    const closeRevDoor = () =>{
        dispatch(setisRevolvingDoorHighlighted(false));
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

export default RevolvingDoorDelete
