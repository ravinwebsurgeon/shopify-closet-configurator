"use client";
import IconClose from "../../../app/assets/icons/IconClose";
import React, { useEffect, useState } from "react";

const Modal = ({
  mainHeading,
  productInformation,
  isModalOpen,
  closeModal,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        setIsOpen(isModalOpen);
      }, 100);
    }
  }, [isModalOpen]);
  const closeModalHandler = () => {
    setIsOpen(false);
    setTimeout(() => {
      closeModal();
    }, 500);
  };
  console.log("children", children);
  return (
    <div
      className={`fixed modal-wrapper w-full h-full top-0 left-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-50 flex justify-center items-center transition-all duration-500 ${
        isOpen ? "!opacity-100" : ""
      } opacity-0`}
    >
      <div className="w-full h-full flex justify-center items-center max-tab-md:px-4">
        <div className="modal-container max-w-[600px] w-full bg-white relative rounded-[2px]">
          <div className="flex justify-between items-center py-5 px-6 border-b border-[#f2f2f2]">
            <h2 className="text-[20px] font-inter text-light-1002 font-semibold">
              {" "}
              {mainHeading || "Productinformatie"}
            </h2>
            <button onClick={() => closeModalHandler()}>
              <IconClose className="w-6 h-6 fill-black" />
            </button>
          </div>
          <div className="py-6 px-10 pb-8 max-h-[calc(100dvh-90px)] overflow-auto max-tab-sm:p-4">
            {children && (children[0] != false || children[1] != false) ? (
              children
            ) : (
              <div>
                {productInformation?.title && (
                  <h3 className="text-black text-base font-inter font-bold">
                    {productInformation?.title}
                  </h3>
                )}
                <div
                  className="text-light-1002 text-sm font-inter leading-[21px] rte"
                  dangerouslySetInnerHTML={{
                    __html: productInformation?.description || "",
                  }}
                ></div>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
