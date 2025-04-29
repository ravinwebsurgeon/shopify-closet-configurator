import React, { useEffect, useMemo, useState } from "react";
import wardroberod from "../../assets/wardrobe-rod.png";
import { useDispatch, useSelector } from "react-redux";
import getComponentPrice from "../../utils/getPrice";
import { addWardrobe } from "../../slices/shelfDetailSlice";
import { toast } from "react-toastify";
const WardrobeComponent = () => {
  const dispatch = useDispatch();
  const [wardrobeRod, setWardrobeRod] = useState("");

  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const width = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSection].width
  );
  const depth = useSelector((state) => state.shelfDetail.racks.depth);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);

  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const { filteredShelfs } = useMemo(() => {
    if (!sections || !selectedSectionKey) return { filteredShelfs: [] };

    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      position: key?.includes("compartment")
        ? parseFloat(value?.compartments?.position?.top || 0)
        : key?.includes("drawer")
        ? parseFloat(value?.drawer?.position?.top || 0)
        : parseFloat(value?.position?.top || 0),
    }));

    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("slidingDoors") &&
        !item?.key.includes("revolvingDoors_")
    );

    return { filteredShelfs };
  }, [sections, selectedSectionKey]);
  const cardData = [
    {
      id: "wardrode_rod",
      imgSrc: wardroberod,
      label: "Garderobestang met dragers",
    },
  ];
  const handleCardClick = (id) => {
    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const changePoitsion = fromKey?.key?.includes("wardrobe_") ? 25 : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          fromPosition: fromKey?.position,
          toPosition: item?.position - changePoitsion,
          space: item?.position - fromKey?.position - changePoitsion,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.toPosition - b.toPosition);

    const findSuitable = spaceBetweenShelves?.find((item) => item?.space >= 25);
    if (findSuitable) {
      dispatch(
        addWardrobe({
          sectionId: selectedSectionKey,
          shelfKey: findSuitable?.to,
          top:
            findSuitable?.fromPosition +
            (findSuitable?.from?.includes("shelves") ? 2.5 : 27.5),
        })
      );
    } else {
      toast.info(
        "Er kunnen geen lades meer worden toegevoegd in deze sectie.",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        }
      );
    }
  };
  return (
    <div className="back-data-conatiner">
      {cardData.map((data) => {
        const price = getComponentPrice({
          material: color,
          component: "wardrobe_rod",
          width,
          depth,
        });

        return (
          <div
            key={data.id}
            className={`back-data-card ${
              data.id === wardrobeRod ? "selected" : ""
            }`}
            onClick={(e) => handleCardClick(data.id)}
          >
            <div className="back-img">
              <img className="back-image" src={data.imgSrc} alt="shelf_image" />
            </div>
            <div className="back-detail-div">
              <span className="back-label">{data.label}</span>
              <span className="back-dimensions">{`${
                width - 2
              }x ${depth} cm`}</span>
              <span className="back-price">{price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WardrobeComponent;

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
  let gap = 20;
  const reversed = spaces.reverse();
  const findAvailble = reversed.find((item) => {
    let condition = item.space >= gap;
    return condition;
  });
  return findAvailble || null;
};
