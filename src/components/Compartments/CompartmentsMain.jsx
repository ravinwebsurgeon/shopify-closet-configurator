import "./Compartments.css";
import React, { useEffect, useState } from "react";
import { compartmentData } from "../../assets/data/Compartment";
import { useDispatch, useSelector } from "react-redux";
import {
  addCompartment,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import getComponentPrice from "../../utils/getPrice";
import { toast } from "react-toastify";

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
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  useEffect(() => {
    const shelveKeys = Object.keys(shelves) || [];
    setShelvesKeys(shelveKeys);
  }, [shelves]);
  useEffect(() => {
    setCount(0);
  }, [selectedSectionKey]);
  useEffect(() => {
    setCount(isCompartmentHighlighted?.compartmentCount || 0);
  }, [isCompartmentHighlighted]);
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  const getAvailbleShelve = (type) => {
    const array = [];
    shelvesKeys.map((item) => {
      const object = {};
      object.key = item;
      object.top =
        shelves[item]?.compartments?.position?.top ||
        shelves[item]?.drawer?.position?.top ||
        shelves[item]?.position?.top;
      object.isCompartments =
        shelves[item]?.compartments || shelves[item]?.drawer;
      array.push(object);
    });

    const shelvesSorted = array.sort((a, b) => b?.top - a?.top);

    const spaces = shelvesSorted
      .map((shelf, index, arr) => {
        const fromTop = parseFloat(arr[index - 1]?.top) || 0;
        const next = arr[index + 1];
        const shelftop = parseFloat(shelf?.top);
        const compartments = shelf?.isCompartments;

        return {
          from: arr[index - 1]?.key,
          to: shelf.key,
          space: shelftop - fromTop,
          compartments: compartments,
          shelfTop: shelftop,
          nextKey: next?.key,
        };
      })
      .filter(Boolean);

    const gap = type == "compartment_divider_set" ? 12.5 : 13.75;
    const findAvailble = spaces.find((item) => {
      const compartments =
        type == "compartment_divider_set"
          ? !item?.compartments
          : !item?.compartments
          ? true
          : item?.compartments.type == "compartment_divider_set"
          ? false
          : item?.compartments.count < 6;
      return (
        item.space >= gap && compartments && !item?.to?.includes("wardrobe_")
      );
    });
    return findAvailble || null;
  };
  const addCompartmentToShelve = ({ id }) => {
    const spaces = getAvailbleShelve(id);
    if (spaces) {
      if (id == "compartment_divider_set") {
        dispatch(
          addCompartment({
            sectionId: selectedSectionKey,
            shelfKey: spaces.to,
            compartmentType: id,
            compartmentCount: id == "compartment_divider_set" ? 1 : 6,
          })
        );
      } else {
        const nextCount = (spaces?.compartments?.count || count) + 1;
        dispatch(
          addCompartment({
            sectionId: selectedSectionKey,
            shelfKey: spaces?.to,
            compartmentType: "sliding_partition",
            compartmentCount:
              nextCount % 6 == 1
                ? 1
                : nextCount % 6 == 2
                ? 2
                : nextCount % 6 == 3
                ? 3
                : nextCount % 6 == 4
                ? 4
                : nextCount % 6 == 5
                ? 5
                : 6,
          })
        );
        setCount(nextCount);
      }
    } else {
      //alert("No more sliding partions/divider sets fit in this section.");
      toast.info(
        "Er passen geen extra schuifwanden of verdelersets meer in deze sectie",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          className: "!font-inter !text-[13px] ",
        }
      );
    }
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-2">
        {compartmentData &&
          compartmentData.map((item) =>
            item.id == "compartment_divider_set" && (dimension.depth <= 20 ||dimension.depth > 80)  ? (
              ""
            ) : (
              <ItemBlock
                productInfo={item}
                key={item.id}
                dimention={item.dimention}
                image={color == "black" ? item.black_image : item.image}
                price={getComponentPrice({
                  material: color,
                  component: "compartment",
                  subtype: item.id,
                  width: dimension.sections[selectedSectionKey].width,
                  depth: dimension.depth,
                })}
                title={`${item.title} ${color === "black" ? "(zwart)" : ""}`}
                itemAction={() => addCompartmentToShelve({ id: item.id })}
                openModal={(e) => openModal(e)}
              />
            )
          )}
      </div>
    </div>
  );
};

export default CompartmentsMain;
