import React, { useState } from "react";
import sidewallClosed from "../../../assets/sidewall.png";
import sidewallPerfo from "../../../assets/sidewall-perfo.png";
import "./SidesComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrSideWall,
  setEditingSides,
  setOpenModal,
  setProductInfoModalContent,
} from "../../../slices/shelfDetailSlice";
import getComponentPrice from "../../../utils/getPrice";
import ItemBlock from "../../Shared/ItemBlock/ItemBlock";

const SidesComponent = () => {
  const dispatch = useDispatch();
  const [sideWall, setSideWall] = useState("");
  const editing = useSelector(
    (state) => state.shelfDetail.racks.isEditingSides
  );
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const height = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSection].height
  );
  const depth = useSelector((state) => state.shelfDetail.racks.depth);
  const color = useSelector((state) => state.shelfDetail.racks.execution.color);

  const cardData = [
    {
      id: "perfo",
      imgSrc: sidewallPerfo,
      label: "Sidewall Perfo",
      productInformation: {
        title: "Zijwand Metaal (perfo)",
        description: `<ul><li>
Geperforeerde zijwanden geven de stellingkast een fraai uiterlijk met de mogelijkheid verschillende <a href="#" target="_blank" rel="noreferrer noopener">inhanghaken</a> te plaatsen voor bijvoorbeeld gereedschap.<br>Zijwanden geven steun aan opslag (voorraad), daarnaast ziet het er ook 
netjes uit met de mogelijkheid middels bijvoorbeeld magneetband een 
stellingcode aan te geven.
<br><br></li></ul>`,
      },
    },
    {
      id: "closed",
      imgSrc: sidewallClosed,
      label: "Sidewall Closed ",
      productInformation: {
        title: "Zijwand Metaal (dicht)",
        description: `<p>Zijwanden geven steun aan opslag (voorraad), daarnaast ziet het er ook netjes uit met de mogelijkheid middels bijvoorbeeld magneetband een stellingcode aan te geven.<br></p>`,
      },
    },
  ];

  const handleCardClick = (wall) => {
    setSideWall(wall);
    if (!editing) {
      dispatch(setEditingSides(true));
    }
    if (wall != sideWall) {
      dispatch(setCurrSideWall(wall));
    }
  };
  const openModal = (item) => {
    dispatch(setOpenModal(true));
    dispatch(setProductInfoModalContent(item.productInformation));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {cardData.map((data) => (
        <ItemBlock
          key={data.id}
          dimention={`${height} x ${depth} cm`}
          image={data.imgSrc}
          itemAction={() => handleCardClick(data.id)}
          openModal={() => openModal(data)}
          price={getComponentPrice({
            material: color,
            component: "sidewall",
            subtype: data.id,
            height,
            depth,
          })}
          productInfo={data?.productInformation}
          title={data.label}
        />
      ))}
    </div>
  );
};

export default SidesComponent;
