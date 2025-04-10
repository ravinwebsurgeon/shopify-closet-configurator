import "./Compartments.css";
import React, { useState } from "react";
import { compartmentData } from "../../assets/data/Compartment";
import IconInfo from "../../assets/icons/IconInfo";
import Modal from "../Shared/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  addComparment,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import getComponentPrice from "../../utils/getPrice";

const CompartmentsMain = () => {
  const dispatch = useDispatch();
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  const getAvailbleShelve = () => {
    console.log(shelves);
    const shelvesKeys = Object.keys(shelves);
    const spaces = shelvesKeys
      .map((shelf, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const fromTop = parseFloat(shelves[fromKey]?.position?.top);
        const shelftop = parseFloat(shelves[shelf]?.position?.top);
        const compartments = shelves[shelf]?.compartments;
        if (index === 0) return null;
        return {
          from: fromKey,
          to: shelf,
          space: shelftop - fromTop,
          compartments: compartments ? true : false,
          shelfTop: shelftop,
        };
      })
      .filter(Boolean);
    const findAvailble = spaces.find(
      (item) => item.space >= 12.5 && !item?.compartments
    );
    return findAvailble || null;
  };
  const addComparmentToShelve = ({ id }) => {
    const spaces = getAvailbleShelve();
    if (spaces) {
      dispatch(
        addComparment({
          sectionId: selectedSectionKey,
          shelfKey: spaces.to,
          compartmentType: id,
          compartmentCount: id == "compartment_divider_set" ? 1 : 4,
        })
      );
    } else {
      alert("No more divider sets fit in this section.");
    }
    console.log(shelves);
    console.log(spaces);
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-2">
        {compartmentData &&
          compartmentData.map((item) => (
            <ItemBlock
              productInfo={item}
              key={item.id}
              dimention={item.dimention}
              image={item.image}
              price={getComponentPrice({
                material: color,
                component: "compartment",
                subtype: item.id,
                width: dimension.sections[selectedSection].width,
                depth: dimension.depth,
              })}
              title={item.title}
              itemAction={() => addComparmentToShelve({ id: item.id })}
              openModal={(e) => openModal(e)}
            />
          ))}
      </div>
    </div>
  );
};

export default CompartmentsMain;
