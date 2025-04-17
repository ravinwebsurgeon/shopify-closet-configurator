import React, { useState } from "react";
import {
  addRevolvingDoor,
  setisRevolvingDoorHighlighted,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { revolvingDoors } from "../../assets/data/Compartment";
import getComponentPrice from "../../utils/getPrice";
import ModalComponent from "../ModalComponent/ModalComponent";
import DoorConfirm from "../ModalChildComponents/DoorComp/DoorConfirm";
import {toast } from 'react-toastify';

const RevolvingDoors = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const revolvingDoorsAll = useSelector(
    (state) =>
      state.shelfDetail.racks.sections[selectedSectionKey].revolvingDoor
  );
const feet = useSelector((state) => state.shelfDetail.racks.execution.feet);
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [contWithout,setContWithout] = useState(false);

  const getDoorPosition50 = (input) => {
    return 0.5 * input - 25;
  };

  const getDoorPosition100 = (input) => {
    return 0.5 * input - 50;
  };

  const handleCardClick = (id) => {

    if(feet != "Adjustable" && !contWithout){
      setIsModalOpen(true);
    }
    
    let position = "";
    const sectionId = selectedSectionKey;
    const revolvingDoors = sections[sectionId]?.revolvingDoor || {};
    const doorHeight = parseInt(id.split("_")[3]);
    let usedHeight = 0;
    Object.keys(revolvingDoors).forEach((key) => {
      const existingHeight = parseInt(revolvingDoors[key].type.split("_")[3]);
      usedHeight += existingHeight;
    });

    const remainingHeight = sections[sectionId].height - usedHeight;

    if (remainingHeight >= doorHeight) {
      let doorKey;
      const existingIndices = Object.keys(revolvingDoors)
        .map((key) => parseInt(key.split("_")[1]))
        .sort((a, b) => a - b);

      let nextIndex = 1;
      while (existingIndices.includes(nextIndex)) {
        nextIndex++;
      }
      doorKey = `door_${nextIndex}`;
      const heightLeft = sections[sectionId].height - usedHeight;
      position =
        doorHeight === 50
          ? getDoorPosition50(heightLeft)
          : getDoorPosition100(heightLeft);
      const revolvingDoorsKeys =
        revolvingDoorsAll &&
        Object.keys(revolvingDoorsAll).map((item) => {
          return {
            key: item,
            type: revolvingDoorsAll[item]?.type,
            position: revolvingDoorsAll[item]?.position,
          };
        });

      const spaces =
        revolvingDoorsKeys &&
        revolvingDoorsKeys
          .sort((a, b) => a.position - b?.position)
          ?.map((item, index, arr) => {
            const typePrev = arr[index - 1]?.type?.includes("50") ? 25 : 50;
            const typeNext = arr[index + 1]?.type?.includes("50") ? 25 : 50;
            arr[index - 1]?.type;
            const prevPos = arr[index - 1]?.position + typePrev || typePrev;
            const nextPos =
              arr[index + 1]?.position || sections[sectionId].height / 2;
            const obj = {};
            if (prevPos < item?.position) {
              obj.prev = {
                type: prevPos < item?.position ? "prev" : "next",
                item: item?.key,
                position: item?.position,
                space: item?.position - prevPos,
              };
            }
            if (nextPos) {
              obj.next = {
                type: "next",
                item: item?.key,
                position: item?.position + typeNext,
                space: nextPos - (item?.position + typeNext),
              };
            }
            return obj;
          });
      if (spaces) {
        const getNext = spaces
          .filter((item) => item?.next && item.next.space > 0)
          .map((item) => item.next);

        const maxNext = getNext.reduce((max, curr) => {
          return !max || curr.position > max.position ? curr : max;
        }, null);
        const getPrev = spaces
          .filter((item) => item?.prev && item.prev.space > 0)
          .map((item) => item.prev);

        const maxPrev = getPrev.reduce((max, curr) => {
          return !max || curr.position > max.position ? curr : max;
        }, null);

        const spaceUnit = id?.includes("50") ? 1 : 2;

        if (maxPrev && (spaceUnit !== 2 || maxPrev.space >= 50)) {
          position = maxPrev.position - (spaceUnit === 2 ? 50 : 25);
        }
        if (
          maxNext &&
          maxNext.space >= (maxPrev?.space ?? 0) &&
          (spaceUnit !== 2 || maxNext.space >= 50)
        ) {
          position = maxNext.position;
        }
        if (maxNext?.space < 50 && maxPrev?.space < 50 && spaceUnit == 2) {
          alert("No more doors can be added to this section");
        } else {
          dispatch(
            addRevolvingDoor({
              sectionId,
              doorKey,
              type: id,
              position,
            })
          );

          dispatch(
            setisRevolvingDoorHighlighted({
              id: doorKey,
              type: id,
              position,
            })
          );
        }
      } else {
        dispatch(
          addRevolvingDoor({
            sectionId,
            doorKey,
            type: id,
            position,
          })
        );

        dispatch(
          setisRevolvingDoorHighlighted({
            id: doorKey,
            type: id,
            position,
          })
        );
      }
    } else {
      //alert("No more doors can be added to this section");
      toast("No more doors can be added to this section",{
        position: "top-center",
      })
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
              image={color=="black" &&(data.id =="door_set_metal_50" || data.id=="door_set_metal_100")?data.black_image[dimension.sections[selectedSectionKey].width]:data.image[dimension.sections[selectedSectionKey].width]}
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
      {isModalOpen && <ModalComponent isOpen={isModalOpen}>
          <DoorConfirm onClose={()=>setIsModalOpen(false)} setContWithout={setContWithout}/>
        </ModalComponent>
      }
    </div>
  );
};

export default RevolvingDoors;
