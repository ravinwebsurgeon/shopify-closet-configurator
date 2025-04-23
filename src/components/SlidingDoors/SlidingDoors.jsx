import React from "react";
import {
  addSlidingDoor,
  setOpenModal,
  setProductInfoModalContent,
  setSlidingDoorHighlighted,
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
  const getDoorPosition50 = (input) => {
    return 0.5 * input - 22.5;
  };
  const isSlidingDoorHighlighted = useSelector(
    (state) => state.shelfDetail.isSlidingDoorHighlighted
  );
  const handleCardClick = (id) => {
    let usedHeight = 0;
    const sectionId = selectedSectionKey;
    const slidingDoors = sections[sectionId]?.slidingDoors || {};
    const shelfs = Object.entries(sections[sectionId].shelves).map(
      ([key, value]) => ({
        key,
        position: key?.includes("slidingDoors")
          ? value?.position
          : parseFloat(value?.position?.top),
      })
    );
    console.log("shelfs", shelfs);
    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("drawer_") && !item?.key.includes("compartment")
    );
    const allDoors = shelfs.filter((item) =>
      item?.key.includes("slidingDoors")
    );

    let spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        return {
          from: fromKey?.key,
          to: item?.key,
          type:
            item?.position <= isSlidingDoorHighlighted?.position
              ? "prev"
              : "next",
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          nextDoorPosition: 0,
          space: item?.position - fromKey?.position,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition);

    const updatedShelves = spaceBetweenShelves?.map((shelfItem) => {
      const doorsInRange =
        allDoors?.filter((item) => {
          return (
            item.position >= shelfItem.fromPosition &&
            item.position <= shelfItem.toPosition
          );
        }) || [];

      if (doorsInRange.length > 0) {
        console.log(
          `Shelf from ${shelfItem.from} to ${shelfItem.to} has ${doorsInRange.length} doors`
        );
      }
      console.log("doorsInRange------------------:->", doorsInRange);
      return {
        ...shelfItem,
        nextDoorPosition:
          shelfItem.toPosition - (doorsInRange.length + 1) * 22.5,
      };
    });

    console.log("updatedShelves", updatedShelves);
    const findSpaceBetweenShelves = updatedShelves?.find(
      (item) => item.space >= 22.5
    );
    // if (slidingDoorsAll) {
    //   const prevDoors = Object.entries(slidingDoorsAll).map(([key, value]) => ({
    //     key,
    //     type: value?.type,
    //     position: value?.position,
    //   }));
    //   prevDoors.forEach(() => {
    //     usedHeight = usedHeight + 22.5;
    //   });

    //   const position = getDoorPosition50(usedHeight);
    //   console.log("usedHeight", position, usedHeight)
    //   spaceBetweenShelves = spaceBetweenShelves?.map((shelfItem) => {
    //     let updatedShelf = { ...shelfItem };

    //     prevDoors?.forEach((item) => {
    //       if (
    //         item.position >= shelfItem?.fromPosition &&
    //         item.position <= shelfItem?.toPosition
    //       ) {

    //         updatedShelf.nextDoorPosition = (item.position || 0) - 22.5;
    //         updatedShelf.space = (updatedShelf.space || 0) - 22.5;
    //       }
    //     });

    //     return updatedShelf;
    //   });
    // }

    console.log("findSpaceBetweenShelves", findSpaceBetweenShelves);
    if (findSpaceBetweenShelves) {
      // console.log("position", position, findSpaceBetweenShelves);
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
    // const remainingHeight = sections[sectionId].height - usedHeight;

    // if (remainingHeight >= doorHeight) {
    //   let doorKey;
    //   const existingIndices = Object.keys(slidingDoors)
    //     .map((key) => parseInt(key.split("_")[1]))
    //     .sort((a, b) => a - b);

    //   let nextIndex = 1;
    //   while (existingIndices.includes(nextIndex)) {
    //     nextIndex++;
    //   }
    //   doorKey = `door_${nextIndex}`;
    //   const heightLeft = sections[sectionId].height - usedHeight;
    //   position = getDoorPosition50(heightLeft);
    //   const doorTypeHeight = 22.5;
    //   const slidingDoorsKeys = [
    //     {
    //       position: 0,
    //       key: "initial",
    //       height: 0,
    //     },
    //     ...(slidingDoorsAll
    //       ? Object.entries(slidingDoorsAll).map(([key, value]) => ({
    //           key,
    //           type: value?.type,
    //           position: value?.position,
    //           height: value?.height,
    //         }))
    //       : []),
    //     {
    //       position: sections[sectionId].height / 2,
    //       key: "last",
    //       height: sections[sectionId].height / 2 + 22.5,
    //     },
    //   ];
    //   console.log(slidingDoorsKeys);
    //   const slidingDoorsKeysSorted = slidingDoorsKeys.sort(
    //     (a, b) => a.position - b?.position
    //   );
    //   const spaces = slidingDoorsKeysSorted
    //     ?.map((item, index, arr) => {
    //       if (index === 0) return null;
    //       const fromKey = arr[index - 1];
    //       const fromTop = fromKey?.position + arr[index - 1]?.height;
    //       const top = item?.position;

    //       return {
    //         from: fromKey?.key,
    //         to: item?.key,
    //         space: top - fromTop,
    //         shelfTop: top,
    //       };
    //     })
    //     .filter(Boolean);
    //   console.log(spaces);
    //   if (spaces) {
    //     const findSpace = spaces.reduce((max, curr) => {
    //       return !max || curr.space > max.space ? curr : max;
    //     }, null);
    //     if (findSpace?.space < 22.5 && doorTypeHeight === 22.5) {
    //       toast.info("Er passen geen deuren meer in deze sectie.", {
    //         position: "top-center",
    //         autoClose: 2000,
    //         hideProgressBar: true,
    //       });
    //       return null;
    //     }
    //     dispatch(
    //       addSlidingDoor({
    //         sectionId,
    //         doorKey,
    //         type: id,
    //         position: findSpace?.shelfTop - doorTypeHeight,
    //         height: doorTypeHeight,
    //       })
    //     );
    //     dispatch(
    //       setSlidingDoorHighlighted({
    //         id: doorKey,
    //         type: id,
    //         position,
    //       })
    //     );
    //   } else {
    //     dispatch(
    //       addSlidingDoor({
    //         sectionId,
    //         doorKey,
    //         type: id,
    //         position,
    //         height: 22.5,
    //       })
    //     );

    //     dispatch(
    //       setSlidingDoorHighlighted({
    //         id: doorKey,
    //         type: id,
    //         position,
    //       })
    //     );
    //   }
    // } else {
    //   //alert("No more doors can be added to this section");
    //   toast.info("Er passen geen deuren meer in deze sectie.", {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: true,
    //   });
    // }
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
