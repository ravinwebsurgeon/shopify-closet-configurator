import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateExecution } from '../../../slices/shelfDetailSlice'

const DoorConfirm = ({onClose,setContWithout}) => {

    const dispatch =useDispatch();

    const handleCancelClick = () =>{
        setContWithout(true);
        onClose();
    }

    const handleConfirmClick = () =>{
        setContWithout(false);
        dispatch(updateExecution({
            feet: "Adjustable"
        }))
        onClose();
    }

  return (
    <>
      <div className="header-div border-b border-[#c2c2c2]">
              <h2 className='text-base !mb-0'>Huidige voetjes aanpassen naar verstelbare voetjes?</h2>
              <button className="add-section-close" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
      </div>
      <div className="data-container-div flex flex-col">
            <p className='text-base text-[#939393]'>Bij het plaatsen van één of meerdere deuren raden we sterk aan verstelbare voetjes te gebruiken, zodat de deuren gesteld kunnen worden. Ook zullen de deuren niet aanlopen aan de grond door de verhoging.</p>
            <p className="text-base text-[#939393] mt-2">Wilt u de huidige voetjes verwisselen voor verstelbare voetjes?</p>
            <div className="button-div mt-3">
                <button className="close-button !w-[47%]" onClick={handleCancelClick}>
                    Doorgaan zonder te wisselen
                </button>
                <button className="add-button !w-[40%]"  onClick={(e)=>handleConfirmClick(e)}>
                Wisselen (aanbevolen)
                </button>
            </div>
        </div>
    </>
  )
}

export default DoorConfirm
