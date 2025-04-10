import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeComparment,
  setCompartmentHighlighted,
} from "../../slices/shelfDetailSlice";

const CompartmentDelete = ({ section, sectionKey }) => {
  const dispatch = useDispatch();
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
    dispatch(setCompartmentHighlighted(""));
  };

  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  return (
    <DeleteAndConfirm
      top={section?.shelves[isCompartmentHighlighted]?.position?.top}
      onDelete={() => deleteCompartment(isCompartmentHighlighted)}
      onConfirm={closeCompartment}
      section={section}
    />
  );
};

export default CompartmentDelete;
