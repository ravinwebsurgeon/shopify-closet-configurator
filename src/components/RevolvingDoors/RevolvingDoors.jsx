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
  const metalRacks = useSelector((state) => state.shelfDetail.racks);

  const selectedSectionKey = metalRacks?.selectedSection;
  const sections = metalRacks?.sections;
  const dimension = metalRacks;
  const color = metalRacks?.execution?.color;
  const revolvingDoorsAll = sections?.[selectedSectionKey]?.revolvingDoor;
  const feet = metalRacks?.execution?.feet;
  
  // const dimension = useSelector((state) => state.shelfDetail.racks);
  // const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  // const revolvingDoorsAll = useSelector(
  //   (state) =>
  //     state.shelfDetail.racks.sections[selectedSectionKey].revolvingDoor
  // );
  // const feet = useSelector((state) => state.shelfDetail.racks.execution.feet);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contWithout, setContWithout] = useState(false);

  const getDoorPosition50 = (input) => {
    return 0.5 * input - 25;
  };

  const getDoorPosition100 = (input) => {
    return 0.5 * input - 50;
  };

  const handleCardClick = (id) => {
    if (feet != "Adjustable" && !contWithout) {
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
      const doorTypeHeight = id.includes("50") ? 25 : 50;
      const revolvingDoorsKeys = [
        {
          position: 0,
          key: "initial",
          height: 0,
        },
        ...(revolvingDoorsAll
          ? Object.entries(revolvingDoorsAll).map(([key, value]) => ({
              key,
              type: value?.type,
              position: value?.position,
              height: value?.height,
            }))
          : []),
        {
          position: sections[sectionId].height / 2,
          key: "last",
          height:
            sections[sectionId].height / 2 + (doorTypeHeight == 50 ? 25 : 25),
        },
      ];

      const revolvingDoorsKeysSorted = revolvingDoorsKeys.sort(
        (a, b) => a.position - b?.position
      );
      const spaces = revolvingDoorsKeysSorted
        ?.map((item, index, arr) => {
          if (index === 0) return null;
          const fromKey = arr[index - 1];
          const fromTop = fromKey?.position + arr[index - 1]?.height;
          const top = item?.position;

          return {
            from: fromKey?.key,
            to: item?.key,
            space: top - fromTop,
            shelfTop: top,
          };
        })
        .filter(Boolean);
      console.log(spaces);
      if (spaces) {
        const findSpace = spaces.reduce((max, curr) => {
          return !max || curr.space > max.space ? curr : max;
        }, null);
        if (findSpace?.space < 50 && doorTypeHeight === 50 || findSpace?.space < 25 && doorTypeHeight === 25) {
          toast.info("Er passen geen deuren meer in deze sectie.",{
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            className: "!font-inter !text-[13px] ",
          })
          return null;
        }
        dispatch(
          addRevolvingDoor({
            sectionId,
            doorKey,
            type: id,
            position: findSpace?.shelfTop - doorTypeHeight,
            height: doorTypeHeight,
          })
        );
        dispatch(
          setisRevolvingDoorHighlighted({
            id: doorKey,
            type: id,
            position,
          })
        );
      } else {
        dispatch(
          addRevolvingDoor({
            sectionId,
            doorKey,
            type: id,
            position,
            height: doorHeight === 100 ? 50 : 25,
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
      toast.info("Er passen geen deuren meer in deze sectie.",{
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        className: "!font-inter !text-[13px] ",
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
              image={
                color == "black" &&
                (data.id == "door_set_metal_50" ||
                  data.id == "door_set_metal_100")
                  ? data.black_image[
                      dimension.sections[selectedSectionKey].width
                    ]
                  : data.image[dimension.sections[selectedSectionKey].width]
              }
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
      {isModalOpen && (
        <ModalComponent isOpen={isModalOpen}>
          <DoorConfirm
            onClose={() => setIsModalOpen(false)}
            setContWithout={setContWithout}
          />
        </ModalComponent>
      )}
    </div>
  );
};

export default RevolvingDoors;
