import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompartmentHighlighted } from "../../slices/shelfDetailSlice";
//import { color } from "html2canvas/dist/types/css/types/color";

const CompartmentsButton = ({
  shelfkey,
  compartments,
  type,
  index,
  selectedSection,
}) => {
  const dispatch = useDispatch();

  const isCompartmentHighlighted = useSelector(
    (state) => state.shelfDetail.isCompartmentHighlighted
  );

  const color = useSelector((state) => state.shelfDetail.racks.execution.color);

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
            compartmentCount:compartments?.count,
            selectedCount: index,
          })
        );
      }}
      className={`compartments_wrapper compartments_wrapper__slide
    ${
      isCompartmentHighlighted?.shelfkey == shelfkey &&
      isCompartmentHighlighted?.selectedCount == index &&
      selectedSection
        ? "isHighlighted"
        : ""
    }
    ${color == "black"?"slider_black":""}
    `}
    >
      <div className="compartments_wrapper_inner_slide">
        <div className="compartments_wrapper_continer">
          <div className="compartments_wrapper-slide"></div>
        </div>
      </div>
    </button>
  );
};

export default CompartmentsButton;
