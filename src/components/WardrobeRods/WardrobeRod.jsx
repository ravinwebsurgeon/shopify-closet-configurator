import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ItemBlock from "../Shared/ItemBlock/ItemBlock";
import getComponentPrice from "../../utils/getPrice";
import { setWardrobeRod } from "../../slices/shelfDetailSlice";

const WardrobeRod = () => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimension = useSelector((state) => state.shelfDetail.racks);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;

  const getAvailbleShelve = () => {
    const shelvesKeys = Object.keys(shelves);
    const spaces = shelvesKeys
      .map((shelf, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        const fromTop = parseFloat(shelves[fromKey]?.position?.top);
        const shelftop = parseFloat(shelves[shelf]?.position?.top);
        const compartments = shelves[shelf]?.compartments;
        const rodTop = parseFloat(shelves[fromKey]?.position?.top)+2;
        let remainingSpace = shelftop - fromTop;
        if (index === 0) return null;
        if(compartments){
            remainingSpace = remainingSpace - 15.5
        }
        return {
          from: fromKey,
          to: shelf,
          space: shelftop - fromTop,
          compartments: compartments ? true : false,
          remainingSpace,
          shelfTop: shelftop,
          rodTop
        };
      })
      .filter(Boolean);
    // const findAvailble = spaces.find(
    //   (item) => item.remainingSpace >= 2.0 && item?.compartments
    // );
    for(const item of spaces){
        if(item.compartments){
            if(item.remainingSpace > 7.5){
                return item;
            }
        }
        else{
            return item;
        }
    }
    // return findAvailble || null;
    return  null;
  };

  const addWardrobeRod = ()=>{
    const spaces = getAvailbleShelve();
    
    if(spaces){
      dispatch(setWardrobeRod({
        sectionId: selectedSectionKey,
        shelfKey: spaces.from,
        position: spaces.rodTop
      }))
    }else{
      alert("No more wardrobe fit in this section.");
    }
    
  }


  const handleCardClick = (id) => {
    addWardrobeRod();
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
            component: "wardrobe_rod",
            // subtype: "garderobestang_met_dragers",

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
