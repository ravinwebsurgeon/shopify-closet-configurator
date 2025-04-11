import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeComparment,
  setCompartmentHighlighted,
} from "../../slices/shelfDetailSlice";

const CompartmentDelete = ({ section, sectionKey }) => {
  const dispatch = useDispatch();
  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  console.log(isCompartmentHighlighted);
  const deleteCompartment = (isCompartmentHighlighted) => {
    dispatch(
      removeComparment({
        sectionId: sectionKey,
        shelfKey: isCompartmentHighlighted,
      })
    );
    closeCompartment();
  };
  const closeCompartment = () => {
    dispatch(
      setCompartmentHighlighted(false)
    );
  };

  return (
    <DeleteAndConfirm
      top={section?.shelves[isCompartmentHighlighted?.shelfkey]?.position?.top}
      onDelete={() => deleteCompartment(isCompartmentHighlighted?.shelfkey)}
      onConfirm={closeCompartment}
      section={section}
    />
  );
};

export default CompartmentDelete;
