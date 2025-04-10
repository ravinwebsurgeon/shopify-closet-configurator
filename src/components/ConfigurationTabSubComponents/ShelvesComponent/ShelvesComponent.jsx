import React, { useEffect, useState } from "react";
import "./ShelvesComponent.css";

import legboard from "../../../assets/legbord-metal-55.png";
import legboardBlack from "../../../assets/legboard-black-55.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setOpenModal,
  setProductInfoModalContent,
  setShowCounter,
} from "../../../slices/shelfDetailSlice";
import ItemBlock from "../../Shared/ItemBlock/ItemBlock";

const ShelvesComponent = () => {
  const dispatch = useDispatch();
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const dimention = useSelector((state) => state.shelfDetail.racks);

  const cardData = [
    { id: "metal", imgSrc: legboard, title: "Shelf with support" },
    { id: "black", imgSrc: legboardBlack, title: "Shelf with support (black)" },
  ];

  const getData = (color) => {
    return cardData.find((data) => data.id === color);
  };

  const [inputData, setInputData] = useState("");

  useEffect(() => {
    setInputData(getData(color));
  }, [color]);

  const handleCardClick = () => {
    dispatch(setShowCounter(true));
  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  // const price = getComponentPrice({
  //   material: color,
  //   component:'shelves',
  //   width,
  //   depth
  // })
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
          price={"11.93"}
          itemAction={() => handleCardClick()}
          openModal={(e) => openModal(e)}
        />
      )}
    </div>
  );
};

export default ShelvesComponent;
