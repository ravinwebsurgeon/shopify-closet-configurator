import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompartmentHighlighted } from "../../slices/shelfDetailSlice";

const CompartmentsButton = ({ shelfkey, compartments }) => {
  const dispatch = useDispatch();

  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  return (
    <button
      onClick={() => {
        dispatch(setCompartmentHighlighted(shelfkey));
      }}
      className={`compartments_wrapper
    ${isCompartmentHighlighted == shelfkey ? "isHighlighted" : ""}
    `}
    >
      <div
        className={`compartments_wrapper_outer compartment_type_${compartments?.type}`}
      >
        <div className={`compartments_wrapper_inner`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </button>
  );
};

export default CompartmentsButton;
