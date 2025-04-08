import React, { useState } from 'react'
import AddBackwallModal from '../ModalChildComponents/AddBackComp/AddBackwallModal';
import ModalComponent from '../ModalComponent/ModalComponent';
import BackRemoveBtn from '../BackRemoveBtn/BackRemoveBtn';


const BackAddBtn = ({height,width,type,id}) => {


    const [isModalOpen,setIsModalOpen] = useState(false);

    const wdth = Number(width)+10;
    const handleClick = (e) =>{
        e.preventDefault();
        setIsModalOpen(true);
    }


  return (
    <>
      <div
        className={`Section_sectionOverflow Section_height${height} ${wdth}`}
      >
        {!type ? ( <button
            type="button"
            className="AddRemove_button Section_removeAccessoireButtonLeft"
            style={{ top: "50em", left: `${wdth}px`}}
            onClick={(e) => handleClick(e)}
          >
            <i
              className="Icon_container AddRemove_icon"
              style={{ width: "16px", height: "16px" }}
            >
              <svg viewBox="0 0 16 16">
                <path
                  fillRule="evenodd"
                  d="M8 0a1 1 0 011 1v6h6a1 1 0 010 2H9v6a1 1 0 01-2 0V9H1a1 1 0 110-2h6V1a1 1 0 011-1z"
                ></path>
              </svg>
            </i>
          </button>):
          (
            <BackRemoveBtn width={wdth} id={id}/>
          )}
    
         
      </div>
      <ModalComponent isOpen={isModalOpen}>
        <AddBackwallModal onClose={() => setIsModalOpen(false)} />
      </ModalComponent>
    </>
  )
}

export default BackAddBtn
