import React from "react";
import {
  addSlidingDoor,
  setOpenModal,
  setProductInfoModalContent,
} from "../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import getComponentPrice from "../../utils/getPrice";
import { toast } from "react-toastify";
import { slidingDoors } from "../../assets/data/Compartment";

const SlidingDoors = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);

  const feet = useSelector((state) => state.shelfDetail.racks.execution.feet);
  const isSlidingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isSlidingDoorHighlighted
  );
  const handleCardClick = (id) => {
    const sectionId = selectedSectionKey;
    const shelfs = Object.entries(sections[sectionId].shelves).map(
      ([key, value]) => ({
        key,
        height: value?.height || 0,
        position:
          key?.includes("slidingDoors") || key?.includes("revolvingDoors_")
            ? value?.position
            : parseFloat(value?.position?.top),
      })
    );
    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("drawer_") && !item?.key.includes("compartment")
    );
    let spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        console.log(fromKey);
        const h =
          fromKey && fromKey?.key.includes("slidingDoors")
            ? 22.5
            : fromKey && fromKey?.key.includes("revolvingDoors_")
            ? fromKey?.height
            : 0;
        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isSlidingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          nextDoorPosition:
            item && item?.key.includes("slidingDoors")
              ? item?.position - 22.5
              : 0,
          space: item?.position - fromKey?.position - h,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);
    console.log(spaceBetweenShelves);
    const findSpaceBetweenShelves = spaceBetweenShelves?.find(
      (item) => item.space >= 22.5
    );
    console.log(findSpaceBetweenShelves);
    if (findSpaceBetweenShelves) {
      dispatch(
        addSlidingDoor({
          sectionId,
          type: id,
          shelfKey: findSpaceBetweenShelves?.to,
          position:
            findSpaceBetweenShelves?.nextDoorPosition ||
            findSpaceBetweenShelves?.toPosition - 22.5,
        })
      );
    } else {
      toast.info("Er passen geen deuren meer in deze sectie.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return null;
    }
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
