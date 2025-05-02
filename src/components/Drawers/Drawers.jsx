import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { addDrawer } from "../../slices/shelfDetailSlice";
import getComponentPrice from "../../utils/getPrice";
import { toast } from "react-toastify";
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

  const { filteredShelfs } = useMemo(() => {
    if (!sections || !selectedSectionKey) return { filteredShelfs: [] };
    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      type: value?.type || null,
      position: key?.includes("compartment")
        ? parseFloat(value?.compartments?.position?.top || 0)
        : key?.includes("drawer")
        ? parseFloat(value?.drawer?.position?.top || 0)
        : parseFloat(value?.position?.top || 0),
    }));
    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("slidingDoors") ||
        !item?.key.includes("revolvingDoors_")
    );

    return { filteredShelfs };
  }, [sections, selectedSectionKey]);

  const handleCardClick = () => {
    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const changePoitsion = item?.key?.includes("compartment")
          ? 15
          : fromKey?.key?.includes("wardrobe")
          ? 25
          : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          fromPosition: fromKey?.position,
          toPosition: item?.position - changePoitsion,
          space: item?.position - fromKey?.position - changePoitsion,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);
    const findSuitable = spaceBetweenShelves?.find(
      (item) => item?.space >= 12.5
    );
    if (findSuitable) {
      dispatch(
        addDrawer({
          sectionId: selectedSectionKey,
          shelfKey: findSuitable?.to,
          top: findSuitable?.toPosition - 6.25,
        })
      );
    } else {
      toast.info(
        "Er kunnen geen lades meer worden toegevoegd in deze sectie.",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          className: "!font-inter !text-[13px] ",
        }
      );
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
            image={
              color == "black"
                ? `/drawers/drawer-metal-black-${dimension.sections[selectedSectionKey].width}.png`
                : `/drawers/Lades-Metaal-Zilver-${dimension.sections[selectedSectionKey].width}.png`
            }
            itemAction={() => handleCardClick("lade_met_dragers")}
            openModal={() => openModal()}
            price={getComponentPrice({
              material: color,
              component: "drawer",
              depth: dimension.depth,
              width: dimension.sections[selectedSectionKey].width,
            })}
            productInfo={false}
            title={color == "black"?"Lade met dragers (zwart)": "Lade met dragers"}
          />
        </div>
      ) : (
        <div className="backwall-warning font-inter font-medium">
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
