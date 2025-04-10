import React from "react";
import IconInfo from "../../../assets/icons/IconInfo";

const ItemBlock = ({
  openModal,
  itemAction,
  image,
  title,
  dimention,
  price,
  productInfo
}) => {
  return (
    <div className="relative group/item w-[calc(50%-5px)]">
    {productInfo &&  <button
        onClick={() => openModal(productInfo)}
        className="absolute top-2 right-2 cursor-pointer invisible opacity-0 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:visible"
      >
        <IconInfo className="w-5 h-5 fill-red-1000" />
      </button> }
      <button
        onClick={() => itemAction()}
        className="border block w-full  border-[#d4d4d4] border-solid rounded-[5px] group-hover/item:border-red-1000"
      >
        <div className="px-3 pt-4">
          <img src={image} className="max-w-full" />
        </div>
        <div className="px-3 pt-3 pb-4">
          <h2 className="font-inter font-semibold  group-hover/item:whitespace-normal text-left text-light-1002 text-sm tracking-normal whitespace-nowrap text-ellipsis overflow-hidden">
            {title}
          </h2>
          <p className="font-inter font-normal text-left text-light-1001 text-sm tracking-normal">
            {dimention}
          </p>
          <span className="font-inter font-semibold text-left text-light-1002 text-sm tracking-normal block mt-3 leading-none">
            {price}
          </span>
        </div>
      </button>
    </div>
  );
};

export default ItemBlock;
