import React from "react";
import {
  addRevolvingDoor,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { revolvingDoors } from "../../assets/data/Compartment";
import getComponentPrice from "../../utils/getPrice";

const RevolvingDoors = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);

  const getDoorPosition = (input) =>{
    return  (0.5 * input) - 25
  }

  const handleCardClick = (id) => {
    const sectionId = selectedSectionKey;
    const revolvingDoors = sections[sectionId]?.revolvingDoor || {};
    const nextDoorIndex = Object.keys(revolvingDoors).length + 1;
    const doorKey = `door_${nextDoorIndex}`;
    const height = Object.keys(revolvingDoors).length > 0 ? sections[sectionId].height - Object.keys(revolvingDoors).length * 50 : sections[sectionId].height;
    
    const position = getDoorPosition(height);
    
    if(height - Object.keys(revolvingDoors).length * 50 >= 50){
      dispatch(addRevolvingDoor({
        sectionId,
        doorKey,
        type:id,
        position
      }))
    }else{
      alert(`no more doors can be added to this section`)
    }
    

  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item?.productInformation));
  };
  return (
    <div className="back-data-conatiner">
      {dimension.sections[selectedSectionKey].width < 115 ? (
        <div className="flex flex-wrap gap-2">
          {revolvingDoors.map((data) => (
            <ItemBlock
              key={data.id}
              dimention={`${dimension.sections[selectedSectionKey].width - 2}x${dimension.depth} cm`}
              image={data.image[dimension.sections[selectedSectionKey].width]}
              itemAction={() => handleCardClick(data.id)}
              openModal={() => openModal(data)}
              price={getComponentPrice({
                material: color,
                component: "revolving_door",
                subtype: data.id,
                height: data.id.split('_')[3] == "50" ? 50 : 100,
                width: dimension.sections[selectedSectionKey].width,
              })}
              productInfo={data?.productInformation}
              title={data.title}
            />
          ))}
        </div>
      ) : (
        <div className="backwall-warning">
          <strong>Geen draaideuren beschikbaar bij deze afmeting</strong>
          <br />
          <p>Draaideuren zijn alleen beschikbaar bij een breedte van:</p>
          <br />
          <strong>55cm - 70cm - 85cm - 100cm</strong>
        </div>
      )}
    </div>
  );
};

export default RevolvingDoors;
