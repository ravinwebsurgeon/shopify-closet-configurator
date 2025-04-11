import React, { useState } from "react";
import "./BackwallComponent.css";
import backPerfo from "../../../assets/back-perfo.png";
import backSolid from "../../../assets/back-solid.png";
import {
  setCurrBackwall,
  setEditingBackwall,
  setOpenModal,
  setProductInfoModalContent,
} from "../../../slices/shelfDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import getComponentPrice from "../../../utils/getPrice";
import ItemBlock from "../../Shared/ItemBlock/ItemBlock";

const BackwallComponent = () => {
  const dispatch = useDispatch();
  const [backwall, setBackwall] = useState(null);
  const editing = useSelector(
    (state) => state.shelfDetail.racks.isEditingBackwall
  );
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const width = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSection].width
  );
  const height = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSection].height
  );
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);

  const cardData = [
    {
      id: "perfo",
      imgSrc: backPerfo,
      label: "BackWall Perfo",
      productInformation: {
        title: "Achterwand Metaal (perfo)",
        description: `<p>De metaal verzinkte achterwanden passen middels diverse zettingen perfect in het systeem en kunnen eenvoudig worden vastgezet met bijgeleverde parkers welke weer precies in het profiel van de staanders passen, dit geeft enorme stevigheid (X- en H-schoren zijn dan niet nodig). In de geperforeerde achterwanden kunnen diverse <a href="#" target="_blank" rel="noreferrer noopener">inhanghaken</a> worden geplaats voor bijvoorbeeld gereedschap.<br>Achterwanden zijn in hoogtes van 50, 100 en 120 cm beschikbaar en kunnen boven elkaar geplaatst worden. Een achterwand van 250 cm hoog is bijvoorbeeld een combinatie van 2x100cm&nbsp; plus 1x50 cm hoog.</p>`,
      },
    },
    {
      id: "closed",
      imgSrc: backSolid,
      label: "Backwall Closed ",
      productInformation: {
        title: "Achterwand Metaal (dicht)",
        description: `<ul><li>De metaal verzinkte achterwanden passen middels diverse zettingen perfect in het systeem en kunnen eenvoudig worden vastgezet met bijgeleverde parkers welke weer precies in het profiel van de staanders passen, 
 dit geeft enorme stevigheid (X- en H-schoren zijn dan niet nodig).<br>Achterwanden zijn in hoogtes van 50, 100 en 120 cm beschikbaar en kunnen boven elkaar geplaatst worden. Een achterwand van 250 cm hoog is bijvoorbeeld een combinatie van 2x 100cm&nbsp; plus 1x 50 cm hoog.<br></li></ul>`,
      },
    },
  ];

  const handleCardClick = (id) => {
    setBackwall(id);
    if (!editing) {
      dispatch(setEditingBackwall(true));
    }
    if (id != backwall) {
      dispatch(setCurrBackwall(id));
    }
  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  return (
    <div className="back-data-conatiner">
      {width < 115 ? (
        <div className="flex flex-wrap gap-2">
          {cardData.map((data) => (
            <ItemBlock
              key={data.id}
              dimention={`${height} x ${width - 2} cm`}
              image={data.imgSrc}
              itemAction={() => handleCardClick(data.id)}
              openModal={() => openModal(data)}
              price={getComponentPrice({
                material: color,
                component: "backwall",
                subtype: data.id,
                height,
                width,
              })}
              productInfo={data?.productInformation}
              title={data.label}
            />
          ))}
        </div>
      ) : (
        <div className="backwall-warning">
          <strong>No back walls available with this size</strong>
          <br />
          <p>Back walls are only available with a width of:</p>
          <br />
          <strong>55cm - 70cm - 85cm - 100cm</strong>
        </div>
      )}
    </div>
  );
};

export default BackwallComponent;
