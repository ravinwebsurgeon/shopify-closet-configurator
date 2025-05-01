import React, { useEffect, useState } from "react";
import "./ShelvesComponent.css";

import legboard from "../../../assets/legbord-metal-55.png";
import legboardBlack from "../../../assets/legboard-black-55.png";
import legboardWood from "../../../assets/shelf-wood.png"
import { useDispatch, useSelector } from "react-redux";
import {
  setOpenModal,
  setProductInfoModalContent,
  setShowCounter,
} from "../../../slices/shelfDetailSlice";
import ItemBlock from "../../Shared/ItemBlock/ItemBlock";
import   getComponentPrice from "../../../utils/getPrice";
import { setWoodShowCounter } from "../../../slices/WoodShelfDetailSlice";
import getDynamicPrice from "../../../utils/getAPIPrice";

const ShelvesComponent = () => {
  const dispatch = useDispatch();
  const metalRacks = useSelector((state) => state.shelfDetail.racks);
  const woodRacks = useSelector((state) => state.woodShelfDetail.racks);
  const color = metalRacks?.execution?.color;
  const material = metalRacks?.execution?.material;
  const selectedSection = material =="metal" ? metalRacks?.selectedSection : woodRacks?.selectedSection;
  const dimention = material =="metal" ? metalRacks: woodRacks;
  const priceData = useSelector((state)=>state.shelfDetail.priceData);

  // const cardData = [
  //   { id: "metal", imgSrc: legboard, title: "Legbord met dragers" },
  //   { id: "black", imgSrc: legboardBlack, title: "Legbord met dragers (zwart)" },
  //   { id: "wood", imgSrc: legboardBlack, title: "Legbord vuren" }
  // ];

  const cardData = {
    metal: {
      metal: { imgSrc: legboard, title: "Legbord met dragers" },
      black: { imgSrc: legboardBlack, title: "Legbord met dragers (zwart)" },
    },
    wood: {
      default: { imgSrc: legboardWood, title: "Legbord vuren" },
    },
  };

  // const getData = (color) => {
  //   return cardData.find((data) => data.id === color);
  // };

  const getData = (color, material) => {
    if (material === "metal") {
      return cardData.metal[color] || cardData.metal.metal;
    }
    if (material === "wood") {
      return cardData.wood.default;
    }
    return null;
  };

  const [inputData, setInputData] = useState("");

  useEffect(() => {
    setInputData(getData(color, material));
  }, [color, material]);

  const handleCardClick = () => {
    if(material == "metal"){
      dispatch(setShowCounter(true));
    }
    else{
      dispatch(setWoodShowCounter(true));
    }
    
  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  // const price = getComponentPrice({
  //   material: material == "metal" ? color : "wood",
  //   component: "shelves",
  //   width: dimention.sections[selectedSection].width,
  //   depth: dimention.depth,
  // });
  const price = getDynamicPrice({
    priceData,
    material: material == "metal" ? color : "wood",
    component: "shelves",
    width: dimention.sections[selectedSection].width,
    depth: dimention.depth,
  })
  return (
    <div className="shelf-data-conatiner">
      {inputData && (
        <ItemBlock
          productInfo={{
            productInformation: {
              title: "LEGBORD METAAL",
              description: `<ul><li><span style="font-size: 14px;">Effectieve </span><span style="font-weight: bolder;"><span style="font-size: 14px;">netto afmeting is 3,5cm minder </span></span><span style="font-size: 14px;">dan beschreven.</span></li></ul><p><span style="font-size: 14px;">Legbord kan bestaan uit meerdere delen ( diepte &gt;40cm = Samengesteld). Legborden worden dan strak achter elkaar in de dieptedragers geplaatst. Voorbeelden samengestelde legborden:</span><br></p><ul><li><span style="font-size: 14px;">&nbsp; &nbsp;&nbsp;</span><span style="font-weight: bolder; font-size: 14px;">50cm diepte</span><span style="font-size: 14px;"> = Legbord 20cm diep + Legbord 30cm diep</span></li><li><span style="font-size: 14px;">&nbsp; &nbsp;</span><span style="font-weight: bolder; font-size: 14px;">&nbsp;60cm diepte</span><span style="font-size: 14px;"> = Legbord 30cm diep + Legbord 30cm diep</span></li><li><span style="font-size: 14px;">&nbsp; &nbsp;&nbsp;</span><span style="font-weight: bolder; font-size: 14px;">70cm diepte</span><span style="font-size: 14px;"> = Legbord 30cm diep + Legbord 40cm diep</span></li><li><span style="font-size: 14px;">&nbsp; &nbsp;&nbsp;</span><span style="font-weight: bolder; font-size: 14px;">80cm diepte</span><span style="font-size: 14px;"> = Legbord 40cm diep + Legbord 40cm diep</span></li></ul><p><br><span style="font-size: 14px;">Kijk voor meer informatie bij <a href="#" target="_blank" rel="noreferrer noopener">LEGBORDEN</a></span><br></p>`,
            },
          }}
          image={inputData.imgSrc}
          dimention={`${dimention.sections[selectedSection].width - 2}x${
            dimention.depth - 2
          } cm `}
          title={inputData.title}
          price={price}
          itemAction={() => handleCardClick()}
          openModal={(e) => openModal(e)}
        />
      )}
    </div>
  );
};

export default ShelvesComponent;
