import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import getComponentPrice from "../../utils/getPrice";

const WardrobeRod = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const handleCardClick = (id) => {
    console.log(id);
  };
  const openModal = () => {};
  return (
    <div className="back-data-conatiner">
      <div className="flex flex-wrap gap-2">
        <ItemBlock
          dimention={`${dimension.sections[selectedSectionKey].width - 2} x ${
            dimension.depth
          } cm`}
          image={`/wardrobe-rod/gardarobestand-55.png`}
          itemAction={() => handleCardClick("garderobestang_met_dragers")}
          openModal={() => openModal()}
          price={getComponentPrice({
            material: color,
            component: "backwall",
            subtype: "garderobestang_met_dragers",
            depth: dimension.depth,
            width: dimension.sections[selectedSectionKey].width,
          })}
          productInfo={false}
          title={"Garderobestang met dragers"}
        />
      </div>
    </div>
  );
};

export default WardrobeRod;
