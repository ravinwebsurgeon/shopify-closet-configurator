'use client';
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRevloDoor,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { revolvingDoors } from "@/app/assets/data/ConfigratorData";
import getComponentPrice from "../../utils/getPrice";
import ModalComponent from "../ModalComponent/ModalComponent";
import DoorConfirm from "../ModalChildComponents/DoorComp/DoorConfirm";
import { toast } from "react-toastify";

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

  // Memoized shelves and doors data to avoid recalculations
  const { filteredShelfs, filteredDoors } = useMemo(() => {
    if (!sections || !selectedSectionKey)
      return { filteredShelfs: [], filteredDoors: [] };

    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      position:
        key?.includes("slidingDoors") || key?.includes("revolvingDoors_")
          ? value?.position
          : parseFloat(value?.position?.top || 0),
    }));

    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("drawer_") && !item?.key.includes("compartment")
    );

    const filteredDoors = shelfs
      .filter(
        (item) =>
          !item?.key.includes("drawer_") &&
          !item?.key.includes("compartment") &&
          !item?.key.includes("shelve")
      )
      .sort((a, b) => a.position - b.position);

    return { filteredShelfs, filteredDoors };
  }, [sections, selectedSectionKey]);

  const calculateDoorSpacing = (id, doorHeight) => {
    if (!section) return null;

    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const h =
          fromKey && fromKey?.key.includes("slidingDoors")
            ? 22.5
            : fromKey && fromKey?.key.includes("revolvingDoors_")
            ? doorHeight
            : 0;

        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isRevolvingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.fromPosition - a.fromPosition);

    const revolvingDoorsKeys = [
      {
        position: 0,
        key: "initial",
        height: 0,
      },
      ...(filteredDoors || []),
      {
        position: section.height / 2 - 2.5,
        key: "last",
        height: section.height / 2 + (doorHeight === 50 ? 25 : 25),
      },
    ];

    const spaceBetweenDoors = revolvingDoorsKeys
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const h =
          fromKey && fromKey?.key.includes("slidingDoors")
            ? 22.5
            : fromKey && fromKey?.key.includes("revolvingDoors_")
            ? fromKey?.height
            : 0;

        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isRevolvingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.fromPosition - b.fromPosition)
      .filter((item) => item?.space > 0)
      .sort((a, b) => b.toPosition - a.toPosition);

    return {
      spaceBetweenShelves,
      spaceBetweenDoors,
    };
  };

  const handleCardClick = (id) => {
    if (feet !== "Adjustable" && !contWithout) {
      setIsModalOpen(true);
    }

    if (!section) {
      toast.error("No section selected", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const doorHeight = parseInt(id.split("_")[3]) / 2;
    const { spaceBetweenShelves, spaceBetweenDoors } = calculateDoorSpacing(
      id,
      doorHeight
    );

    const findSpaceBetweenShelves = spaceBetweenShelves?.find(
      (item) => item.space >= 25
    );
    const findSpaceBetweenDoors = spaceBetweenDoors?.find(
      (item) => item.space >= 25
    );

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
    if (item?.productInformation) {
      dispatch(setOpenModal(true));
      dispatch(setProductInfoModalContent(item.productInformation));
    }
  };

  const isRevolvingDoorAvailable = section && section.width < 115;

  const getItemImage = (data) => {
    const isMetalDoor =
      data.id === "door_set_metal_50" || data.id === "door_set_metal_100";

    if (color === "black" && isMetalDoor && data.black_image) {
      return data.black_image[section.width] || data.image[section.width];
    }

    return data.image?.[section.width];
  };

  return (
    <div className="back-data-conatiner">
      {isRevolvingDoorAvailable ? (
        <div className="flex flex-wrap gap-2">
          {revolvingDoors.map((data) => (
            <ItemBlock
              key={data.id}
              dimention={`${(section?.width || 0) - 2}x${dimension.depth} cm`}
              image={getItemImage(data)}
              itemAction={() => handleCardClick(data.id)}
              openModal={() => openModal(data)}
              price={getComponentPrice({
                material: color,
                component: "revolving_door",
                subtype: data.id,
                height: data.id.split("_")[3] === "50" ? 50 : 100,
                width: section?.width,
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
