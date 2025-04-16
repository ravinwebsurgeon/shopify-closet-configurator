import React from "react";
import {
  addRevolvingDoor,
  removeDeletedDoor,
  setisRevolvingDoorHighlighted,
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
  const deletedRevDoors = useSelector((state) => state.shelfDetail.deletedRevDoors);

  // const getDoorPosition50 = (input) =>{
  //   return  (0.5 * input) - 25
  // }

  // const getDoorPosition100 = (input) =>{
  //   return  (0.5 * input) - 50
  // }

  // const handleCardClick = (id) => {
  //   console.log("IIDD",id)
  //   let height = "";
  //   let position = "";
  //   const sectionId = selectedSectionKey;
  //   const revolvingDoors = sections[sectionId]?.revolvingDoor || {};
  //   console.log("REVOLING DOOR -->", JSON.stringify(revolvingDoors))
  //   const nextDoorIndex = Object.keys(revolvingDoors).length + 1;
  //   const doorKey = `door_${nextDoorIndex}`;

  //   if(id.split('_')[3] == 50){
  //     height = Object.keys(revolvingDoors).length > 0 ? sections[sectionId].height - Object.keys(revolvingDoors).length * 50 : sections[sectionId].height;
  //     position = getDoorPosition50(height);
  //   }
  //   else if(id.split('_')[3] == 100){
  //     height = Object.keys(revolvingDoors).length > 0 ? sections[sectionId].height - Object.keys(revolvingDoors).length * 100 : sections[sectionId].height;
  //     position = getDoorPosition100(height);
  //   }

  //   // - Object.keys(revolvingDoors).length * 50
  //   if(height  >= 50){
  //     dispatch(addRevolvingDoor({
  //       sectionId,
  //       doorKey,
  //       type:id,
  //       position
  //     }))
  //     dispatch(setisRevolvingDoorHighlighted({
  //       id:doorKey,
  //       position
  //     }))
  //   }else{
  //     alert(`no more doors can be added to this section`)
  //   }

  // };

  // const getDoorPosition50 = (input) =>{
  //   return  (0.5 * input) - 25
  // }

  // const getDoorPosition100 = (input) =>{
  //   return  (0.5 * input) - 50
  // }

  // const handleCardClick = (id) => {
  //   let height = "";
  //   let position = "";
  //   const sectionId = selectedSectionKey;
  //   const revolvingDoors = sections[sectionId]?.revolvingDoor || {};
  //   const nextDoorIndex = Object.keys(revolvingDoors).length + 1;
  //   const doorKey = `door_${nextDoorIndex}`;

  //   // Calculate total used height by checking each door's actual height
  //   let usedHeight = 0;
  //   Object.keys(revolvingDoors).forEach(key => {
  //     const doorType = revolvingDoors[key].type;
  //     const doorHeight = parseInt(doorType.split('_')[3]);
  //     usedHeight += doorHeight;
  //   });

  //   // Get the current door height
  //   const doorHeight = parseInt(id.split('_')[3]);

  //   // Calculate remaining height
  //   const remainingHeight = sections[sectionId].height - usedHeight;

  //   if(remainingHeight >= doorHeight){
  //     if(doorHeight == 50){
  //       height = sections[sectionId].height - usedHeight;
  //       position = getDoorPosition50(height);
  //     }
  //     else if(doorHeight == 100){
  //       height = sections[sectionId].height - usedHeight;
  //       position = getDoorPosition100(height);
  //     }

  //     dispatch(addRevolvingDoor({
  //       sectionId,
  //       doorKey,
  //       type:id,
  //       position
  //     }))
  //     dispatch(setisRevolvingDoorHighlighted({
  //       id:doorKey,
  //       position
  //     }))
  //   }else{
  //     alert(`no more doors can be added to this section`)
  //   }
  // };

  const getDoorPosition50 = (input) => {
    return 0.5 * input - 25;
  };

  const getDoorPosition100 = (input) => {
    return 0.5 * input - 50;
  };

  // const handleCardClick = (id) => {
  //   let height = "";
  //   let position = "";
  //   const sectionId = selectedSectionKey;
  //   const revolvingDoors = sections[sectionId]?.revolvingDoor || {};

  //   // Find gaps in door indices (deleted doors)
  //   const existingIndices = Object.keys(revolvingDoors)
  //     .map(key => parseInt(key.split('_')[1]))
  //     .sort((a, b) => a - b);

  //   // Find the first missing index or use next available
  //   let nextDoorIndex = 1;
  //   while (existingIndices.includes(nextDoorIndex)) {
  //     nextDoorIndex++;
  //   }
  //   const doorKey = `door_${nextDoorIndex}`;

  //   // Calculate total used height by checking each door's actual height
  //   let usedHeight = 0;
  //   Object.keys(revolvingDoors).forEach(key => {
  //     const doorType = revolvingDoors[key].type;
  //     const doorHeight = parseInt(doorType.split('_')[3]);
  //     usedHeight += doorHeight;
  //   });

  //   // Get the current door height
  //   const doorHeight = parseInt(id.split('_')[3]);

  //   // Calculate remaining height
  //   const remainingHeight = sections[sectionId].height - usedHeight;

  //   if(remainingHeight >= doorHeight){
  //     // Check if we're filling a deleted position
  //     if (nextDoorIndex <= existingIndices.length) {
  //       // We're filling a gap - find where the deleted door was

  //       // Get positions of existing doors to better place the new door
  //       const doorPositionsArray = [];
  //       Object.keys(revolvingDoors).forEach(key => {
  //         doorPositionsArray.push({
  //           index: parseInt(key.split('_')[1]),
  //           position: revolvingDoors[key].position
  //         });
  //       });

  //       // Sort by position
  //       doorPositionsArray.sort((a, b) => a.position - b.position);

  //       if (nextDoorIndex === 1) {
  //         // First door was deleted
  //         position = sections[sectionId].height / 3;
  //       } else if (nextDoorIndex > existingIndices[existingIndices.length - 1]) {
  //         // Last door was deleted
  //         position = (sections[sectionId].height * 2) / 3;
  //       } else {
  //         // Middle door was deleted - find the doors before and after
  //         let beforePosition = 0;
  //         let afterPosition = sections[sectionId].height;

  //         for (const door of doorPositionsArray) {
  //           if (door.index < nextDoorIndex) {
  //             beforePosition = Math.max(beforePosition, door.position);
  //           } else if (door.index > nextDoorIndex) {
  //             afterPosition = Math.min(afterPosition, door.position);
  //           }
  //         }

  //         // Place in the middle between the two surrounding doors
  //         position = (beforePosition + afterPosition) / 2;
  //       }
  //     } else if(doorHeight == 50){
  //       height = sections[sectionId].height - usedHeight;
  //       position = getDoorPosition50(height);
  //     }
  //     else if(doorHeight == 100){
  //       height = sections[sectionId].height - usedHeight;
  //       position = getDoorPosition100(height);
  //     }

  //     dispatch(addRevolvingDoor({
  //       sectionId,
  //       doorKey,
  //       type:id,
  //       position
  //     }))
  //     dispatch(setisRevolvingDoorHighlighted({
  //       id:doorKey,
  //       position
  //     }))
  //   }else{
  //     alert(`no more doors can be added to this section`)
  //   }
  // };


//================
  const handleCardClick = (id) => {
    let position = "";
    const sectionId = selectedSectionKey;
    const revolvingDoors = sections[sectionId]?.revolvingDoor || {};
    const deletedDoors = deletedRevDoors[sectionId] || {};
    const doorHeight = parseInt(id.split('_')[3]);
  
    // Calculate used height
    let usedHeight = 0;
    Object.keys(revolvingDoors).forEach(key => {
      const existingHeight = parseInt(revolvingDoors[key].type.split('_')[3]);
      usedHeight += existingHeight;
    });
  
    const remainingHeight = sections[sectionId].height - usedHeight;
  
    if (remainingHeight >= doorHeight) {
      // Try to reuse deleted door positions
      const reusableKey = Object.keys(deletedDoors).find(key => {
        const { position, height } = deletedDoors[key];
        return height >= doorHeight;
      });
  
      let doorKey;
      if (reusableKey) {
        // Reuse deleted door
        position = deletedDoors[reusableKey].position;
        doorKey = reusableKey;
  
        dispatch(removeDeletedDoor({ sectionId, doorKey }));
      } else {
        // No deleted door to reuse, create a new one
        const existingIndices = Object.keys(revolvingDoors)
          .map(key => parseInt(key.split('_')[1]))
          .sort((a, b) => a - b);
  
        let nextIndex = 1;
        while (existingIndices.includes(nextIndex)) {
          nextIndex++;
        }
        doorKey = `door_${nextIndex}`;
  
        // Default positioning
        const heightLeft = sections[sectionId].height - usedHeight;
        position = doorHeight === 50 ? getDoorPosition50(heightLeft) : getDoorPosition100(heightLeft);
      }
  
      dispatch(addRevolvingDoor({
        sectionId,
        doorKey,
        type: id,
        position
      }));
  
      dispatch(setisRevolvingDoorHighlighted({
        id: doorKey,
        position
      }));
    } else {
      alert("No more doors can be added to this section");
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
              dimention={`${dimension.sections[selectedSectionKey].width - 2}x${
                dimension.depth
              } cm`}
              image={data.image[dimension.sections[selectedSectionKey].width]}
              itemAction={() => handleCardClick(data.id)}
              openModal={() => openModal(data)}
              price={getComponentPrice({
                material: color,
                component: "revolving_door",
                subtype: data.id,
                height: data.id.split("_")[3] == "50" ? 50 : 100,
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
