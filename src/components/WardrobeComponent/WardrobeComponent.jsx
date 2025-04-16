import React, { useEffect, useState } from "react";
import wardroberod from "../../assets/wardrobe-rod.png";
import { useSelector } from "react-redux";
import getComponentPrice from "../../utils/getPrice";
const WardrobeComponent = () => {
  const [wardrobeRod, setWardrobeRod] = useState("");

  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const width = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSection].width
  );
  const [shelvesKeys, setShelvesKeys] = useState([]);
  const depth = useSelector((state) => state.shelfDetail.racks.depth);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;
  const cardData = [
    {
      id: "wardrode_rod",
      imgSrc: wardroberod,
      label: "Garderobestang met dragers",
    },
  ];
  useEffect(() => {
    const shelveKeys = Object.keys(shelves) || [];
    setShelvesKeys(shelveKeys);
  }, [shelves]);
  const handleCardClick = (e, id) => {
    setWardrobeRod(id);
    const space = getAvailbleShelve({ shelvesKeys, shelves });
    if (!space) {
      alert("No more divider sets fit in this section.");
    }
    console.log();
    alert(`wardrobe rod clicked..`);
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
            onClick={(e) => handleCardClick(e, data.id)}
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
