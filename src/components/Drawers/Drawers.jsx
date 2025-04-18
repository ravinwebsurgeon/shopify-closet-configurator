import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { addDrawer } from "../../slices/shelfDetailSlice";
import getComponentPrice from "../../utils/getPrice";
const Drawers = () => {
  const dispatch = useDispatch();
  const [shelvesKeys, setShelvesKeys] = useState([]);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  useEffect(() => {
    const shelveKeys = Object.keys(shelves) || [];
    setShelvesKeys(shelveKeys);
  }, [shelves]);
  const handleCardClick = () => {
    const space = getAvailbleShelve({ shelvesKeys, shelves });
    if (space) {
      const _space = space?.shelfTop - 7.5;
      dispatch(
        addDrawer({
          sectionId: selectedSectionKey,
          shelfKey: space?.to,
          top: space?.to?.includes("compartment_") ? _space - 11.25 : _space,
        })
      );
    } else {
      alert("No more divider sets fit in this section.");
    }
  };
  const openModal = () => {};
  return (
    <div className="back-data-conatiner">
      {dimension.depth > 30 &&
      dimension.depth < 60 &&
      dimension.sections[selectedSectionKey].width < 115 ? (
        <div className="flex flex-wrap gap-2">
          <ItemBlock
            dimention={`${dimension.sections[selectedSectionKey].width - 2} x ${
              dimension.depth
            } cm`}
            image={color=="black"?`/drawers/drawer-metal-black-${dimension.sections[selectedSectionKey].width}.png`:`/drawers/Lades-Metaal-Zilver-${dimension.sections[selectedSectionKey].width}.png`}
            itemAction={() => handleCardClick("lade_met_dragers")}
            openModal={() => openModal()}
            price={getComponentPrice({
              material: color,
              component: "drawer",
              depth: dimension.depth,
              width: dimension.sections[selectedSectionKey].width,
            })}
            productInfo={false}
            title={"Lade met dragers"}
          />
        </div>
      ) : (
        <div className="backwall-warning">
          <strong>Geen lades beschikbaar bij deze afmetingen</strong>
          <br />
          <p>Lades zijn alleen beschikbaar bij een breedte van:</p>
          <br />
          <strong>55cm - 70cm - 85cm - 100cm</strong>
          <br />
          <p>en bij een diepte van:</p>
          <br />
          <strong>40cm - 50cm</strong>
        </div>
      )}
    </div>
  );
};

export default Drawers;

const getAvailbleShelve = ({ shelvesKeys, shelves }) => {
  const array = [];
  shelvesKeys.map((item) => {
    const object = {};
    object.key = item;
    object.top =
      shelves[item]?.drawer?.position?.top ||
      shelves[item]?.compartments?.position?.top ||
      shelves[item]?.position?.top;
    object.isDrawer = shelves[item]?.drawer || shelves[item]?.compartments;
    array.push(object);
  });

  const shelvesSorted = array.sort((a, b) => b?.top - a?.top);
  const spaces = shelvesSorted
    .map((shelf, index, arr) => {
      const fromTop = parseFloat(arr[index - 1]?.top) || 0;
      const next = arr[index + 1];
      const shelftop = parseFloat(shelf?.top);
      const drawer = shelf?.isDrawer;
      return {
        from: arr[index - 1]?.key,
        to: shelf.key,
        space: shelftop - fromTop,
        drawer: drawer,
        shelfTop: shelftop,
        nextKey: next?.key,
      };
    })
    .filter(Boolean);
  let gap = 12.5;
  const reversed = spaces.reverse();
  const findAvailble = reversed.find((item) => {
    let condition = item.space >= gap;
    if (item?.to?.includes("compartment_") && item?.from?.includes("drawer_")) {
      condition = item.space >= 18.76;
    }

    return condition;
  });
  return findAvailble || null;
};
