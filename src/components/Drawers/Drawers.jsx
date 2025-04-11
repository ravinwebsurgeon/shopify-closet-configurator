import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";

import getComponentPrice from "../../utils/getPrice";

const Drawers = () => {
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
      {dimension.depth > 30 &&
      dimension.depth < 60 &&
      dimension.sections[selectedSectionKey].width < 115 ? (
        <div className="flex flex-wrap gap-2">
          <ItemBlock
            dimention={`${dimension.sections[selectedSectionKey].width - 2} x ${
              dimension.depth
            } cm`}
            image={`/drawers/Lades-Metaal-Zilver-${dimension.sections[selectedSectionKey].width}.png`}
            itemAction={() => handleCardClick("lade_met_dragers")}
            openModal={() => openModal()}
            price={getComponentPrice({
              material: color,
              component: "backwall",
              subtype: "lade_met_dragers",
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
