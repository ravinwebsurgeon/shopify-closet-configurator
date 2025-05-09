import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSection, deleteSideWall, openDeleteModal, setCurrSelectedSection, updateSideWall } from '../../slices/shelfDetailSlice';

const SectionDelete = ({onClose}) => {
    const dispatch = useDispatch();
    const metalRacks = useSelector((state) => state.shelfDetail.racks);
    const currentSelectedSection = metalRacks.selectedSection;
    const sections = metalRacks.sections;
    const sectionKeys = Object.keys(sections);
      

    const handleConfirmClick = (e) =>{
        const activeIndex = sectionKeys.indexOf(currentSelectedSection);
            const nextSectionId =
              activeIndex < sectionKeys.length ? sectionKeys[activeIndex + 1] : null;
            const prevSectionId =
              activeIndex < sectionKeys.length ? sectionKeys[activeIndex - 1] : null;
            const selectedSection = sections[currentSelectedSection];
            const nextSection = nextSectionId ? sections[nextSectionId] : null;
            if (
              selectedSection?.sideWall?.right &&
              selectedSection.sideWall.right.isRight &&
              nextSection
            ) {
              const rightSideWall = selectedSection.sideWall.right;
               if(prevSectionId && nextSectionId){
                if(sections[prevSectionId].height == 100  ||
                  sections[prevSectionId].height == 150 ||
                  sections[prevSectionId].height == 200 ||
                  sections[prevSectionId].height == 250){
                  dispatch(updateSideWall({
                    sectionId:prevSectionId,
                    side:"right",
                    type: rightSideWall.type,
                    height:sections[prevSectionId].height
                  }))
                }
        
              }else{
                if(sections[nextSectionId].height == 100  ||
                  sections[nextSectionId].height == 150 ||
                  sections[nextSectionId].height == 200 ||
                  sections[nextSectionId].height == 250
                 ){
                  dispatch(
                    updateSideWall({
                      sectionId: nextSectionId,
                      side: "left",
                      ...rightSideWall,
                    })
                  );
                 }
              }
        
            }
            else if(prevSectionId){
              const rightSideWall = sections[prevSectionId].sideWall.right;
              if(rightSideWall.isRight){
                if(sections[prevSectionId].height == 100  ||
                  sections[prevSectionId].height == 150 ||
                  sections[prevSectionId].height == 200 ||
                  sections[prevSectionId].height == 250
                 ){
                  dispatch(updateSideWall({ 
                    sectionId:prevSectionId,
                    side:"right",
                    type:rightSideWall.type,
                    height:sections[prevSectionId].height,
                  }))
                }else{
                  dispatch(deleteSideWall({
                    sectionId:prevSectionId,
                    side:"right"
                  }))
                }
              }
            }
            dispatch(deleteSection(currentSelectedSection));
        
            if(prevSectionId){
        
                if(sections[prevSectionId].height < selectedSection.standHeight){
        
                  const nextSectionExists = nextSectionId && sections[nextSectionId];
        
                  const newHeight = nextSectionExists && sections[nextSectionId].height > selectedSection.height
                    ? sections[nextSectionId].height
                    : sections[prevSectionId].height;
        
                  dispatch(updateSectionDimensions({
                    sectionId: prevSectionId,
                    dimension: "standHeight",
                    value: newHeight
                  }))
                }
            }
            dispatch(
              setCurrSelectedSection(prevSectionId ? prevSectionId : nextSectionId)
            );
        
            dispatch(openDeleteModal(false));
            onClose();
        
    }


  return (
    <>
         <div className="data-container-div flex flex-col">
        <p className="text-base text-[#939393]">
            Je staat op het punt een sectie te verwijderen. 
            Weet je zeker dat je deze actie wilt uitvoeren? Dit is niet te herstellen.
        </p>
        <div className="button-div mt-3">
          <button className="close-button" onClick={onClose}>
              Annuleren
          </button>
          <button className="border border-[#C50606] text-[#C50606] p-[0.8rem] rounded hover:bg-[#C50606] hover:text-white transition-colors duration-300 ease-in-out"
           onClick={(e) => handleConfirmClick(e)}>
              Verwijder sectie
          </button>
        </div>
      </div>
      
    </>
  )
}

export default SectionDelete
