'use client';
import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCompartment,
  setCompartmentHighlighted,
} from "../../slices/shelfDetailSlice";

const CompartmentDelete = ({ section, sectionKey }) => {
  const dispatch = useDispatch();
  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );  
  const deleteCompartment = (shelfKey, isCompartmentHighlighted) => {
    dispatch(
      removeCompartment({
        sectionId: sectionKey,
        shelfKey: shelfKey,
        compartment: isCompartmentHighlighted,
      })
    );
    closeCompartment();
  };
  const closeCompartment = () => {
    dispatch(setCompartmentHighlighted(false));
  };

  return (
    <DeleteAndConfirm
      top={
        section?.shelves[isCompartmentHighlighted?.shelfkey]?.compartments
          ?.position?.top ||
        section?.shelves[isCompartmentHighlighted?.shelfkey]?.position?.top
      }
      onDelete={() =>
        deleteCompartment(
          isCompartmentHighlighted?.shelfkey,
          isCompartmentHighlighted
        )
      }
      onConfirm={closeCompartment}
      section={section}
    />
  );
};

export default CompartmentDelete;
