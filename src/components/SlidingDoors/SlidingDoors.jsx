import React from "react";
import {
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import { revolvingDoors, slidingDoors } from "../../assets/data/Compartment";
import getComponentPrice from "../../utils/getPrice";

const SlidingDoors = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const handleCardClick = (id) => {
    console.log(id);
  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item?.productInformation));
  };
  return (
    <div className="back-data-conatiner">
      {dimension.sections[selectedSectionKey].width > 70 &&
      dimension.sections[selectedSectionKey].width < 115 ? (
        <div className="flex flex-wrap gap-2">
          {slidingDoors.map(
            (data) =>
              data?.notActiveWidth !=
                dimension.sections[selectedSectionKey].width && (
                <ItemBlock
                  key={data.id}
                  dimention={`${
                    dimension.sections[selectedSectionKey].width - 2
                  } cm`}
                  image={data.image}
                  itemAction={() => handleCardClick(data.id)}
                  openModal={() => openModal(data)}
                  price={getComponentPrice({
                    material: color,
                    component: "sliding_door",
                    subtype: data.id,
                    width: dimension.sections[selectedSectionKey].width,
                  })}
                  productInfo={data?.productInformation}
                  title={data.title}
                />
              )
          )}
        </div>
      ) : (
        <div className="backwall-warning">
          <strong>Geen shuifdeuren beschikbaar bij deze afmeting</strong>
          <br />
          <p>Schuifdeuren zijn alleen beschikbaar bij een breedte van:</p>
          <br />
          <strong>85cm - 100cm</strong>
        </div>
      )}
    </div>
  );
};

export default SlidingDoors;
