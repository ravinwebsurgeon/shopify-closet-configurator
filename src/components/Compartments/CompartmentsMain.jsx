import "./Compartments.css";
import React, { use, useEffect, useState } from "react";
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
  function getArrayIndex(number, chunkSize = 4) {
    return Math.floor((number - 1) / chunkSize);
  }
  const [count, setCount] = useState(0);
  const [shelvesKeys, setShelvesKeys] = useState([]);
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const selectedSectionKey = useSelector((state) => state.shelfDetail.racks.selectedSection);
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  useEffect(() => {
    const shelveKeys = Object.keys(shelves) || [];
    setShelvesKeys(shelveKeys);
  }, []);
  useEffect(() => {
    setCount(0);
  }, [selectedSectionKey]);
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  const getAvailbleShelve = (type) => {
    console.log(type);
    const array = [];
    shelvesKeys.map((item) => {
      const object = {};
      object.key = item;
      object.top = shelves[item]?.position?.top;
      object.compartments = shelves[item]?.compartments;
      array.push(object);
    });

    const shelvesSorted = array.sort((a, b) => b?.top - a?.top);

    const spaces = shelvesSorted
      .map((shelf, index, arr) => {
        const fromTop = parseFloat(arr[index - 1]?.top) || 0;
        const shelftop = parseFloat(shelf?.top);
        const compartments = shelf?.compartments;
        return {
          from: arr[index - 1]?.key,
          to: shelf.key,
          space: shelftop - fromTop,
          compartments: compartments,
          shelfTop: shelftop,
        };
      })
      .filter(Boolean);
    const gap = type == "compartment_divider_set" ? 12.5 : 13.75;
    console.log("spaces--->", spaces);
    const findAvailble = spaces.find((item) => {
      const compartments =
        type == "compartment_divider_set"
          ? !item?.compartments
          : !item?.compartments
          ? true
          : item?.compartments.type == "compartment_divider_set"
          ? false
          : item?.compartments.count < 4;
      return item.space >= gap && compartments;
    });
    return findAvailble || null;
  };
  const addComparmentToShelve = ({ id }) => {
    const spaces = getAvailbleShelve(id);
    console.log("spaces--->", spaces);
    if (spaces) {
      if (id == "compartment_divider_set") {
        dispatch(
          addComparment({
            sectionId: selectedSectionKey,
            shelfKey: spaces.to,
            compartmentType: id,
            compartmentCount: id == "compartment_divider_set" ? 1 : 4,
          })
        );
      } else {
        const nextCount = count + 1;
        let index = getArrayIndex(nextCount);
        const top = parseFloat(shelves[shelvesKeys[0]].position.top);
        if (top < 13.75) {
          index = index + 1;
        }
        dispatch(
          addComparment({
            sectionId: selectedSectionKey,
            shelfKey: shelvesKeys[index],
            compartmentType: "sliding_partition",
            compartmentCount:
              nextCount % 4 == 1
                ? 1
                : nextCount % 4 == 2
                ? 2
                : nextCount % 4 == 3
                ? 3
                : 4,
          })
        );
        setCount(nextCount);
      }
    } else {
      alert("No more divider sets fit in this section.");
    }
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-2">
        {compartmentData &&
          compartmentData.map((item) =>
            item.id == "compartment_divider_set" && dimension.depth <= 20 ? (
              ""
            ) : (
              <ItemBlock
                productInfo={item}
                key={item.id}
                dimention={item.dimention}
                image={item.image}
                price={getComponentPrice({
                  material: color,
                  component: "compartment",
                  subtype: item.id,
                  width: dimension.sections[selectedSectionKey].width,
                  depth: dimension.depth,
                })}
                title={item.title}
                itemAction={() => addComparmentToShelve({ id: item.id })}
                openModal={(e) => openModal(e)}
              />
            )
          )}
      </div>
    </div>
  );
};

export default CompartmentsMain;
