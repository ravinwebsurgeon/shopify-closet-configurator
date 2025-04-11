import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompartmentHighlighted } from "../../slices/shelfDetailSlice";

const CompartmentsButton = ({
  shelfkey,
  compartments,
  type,
  selectedSection,
}) => {
  const dispatch = useDispatch();

  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );
  return type === "compartment_divider_set" ? (
    <button
      onClick={() => {
        dispatch(
          setCompartmentHighlighted({
            shelfkey,
            compartmentType: compartments?.type,
          })
        );
      }}
      className={`compartments_wrapper
    ${
      isCompartmentHighlighted?.shelfkey == shelfkey && selectedSection
        ? "isHighlighted"
        : ""
    }
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
  ) : (
    <button
      onClick={() => {
        dispatch(
          setCompartmentHighlighted({
            shelfkey,
            compartmentType: compartments?.type,
          })
        );
      }}
      className={`compartments_wrapper compartments_wrapper__slide
    ${
      isCompartmentHighlighted?.shelfkey == shelfkey && selectedSection
        ? "isHighlighted"
        : ""
    }
    `}
    >
      <div class="compartments_wrapper_inner_slide">
        <div class="compartments_wrapper_continer">
          <div class="compartments_wrapper-slide"></div>
        </div>
      </div>
    </button>
  );
};

export default CompartmentsButton;
