'use client';
import React, { useEffect, useMemo, useState } from "react";
import "./WardrobeRods.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsWardrobeHighlighted } from "../../slices/shelfDetailSlice";

const WardrobeRods = ({ top, index, doorKey }) => {
  const dispatch = useDispatch();
  const isWardrobeHighlighted = useSelector(
    (state) => state.shelfDetail.isWardrobeHighlighted
  );
  const [isHeight, setIsHeight] = useState("");
  const sections = useSelector((state) => state.shelfDetail.racks.sections);
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const section = sections[selectedSectionKey];
  const shelves = section?.shelves;

  const { filteredShelfs } = useMemo(() => {
    if (!sections || !selectedSectionKey) return { filteredShelfs: [] };
    const shelfs = Object.entries(
      sections[selectedSectionKey]?.shelves || {}
    ).map(([key, value]) => ({
      key,
      height: value?.height || 0,
      type: value?.type || null,
      position: key?.includes("compartment")
        ? parseFloat(value?.compartments?.position?.top || 0)
        : key?.includes("drawer")
        ? parseFloat(value?.drawer?.position?.top || 0)
        : parseFloat(value?.position?.top || 0),
    }));

    const filteredShelfs = shelfs.filter(
      (item) =>
        !item?.key.includes("slidingDoors") ||
        !item?.key.includes("revolvingDoors_") ||
        !item?.key.includes("wardrobe_") ||
        !item?.key.includes("compartment")
    );

    return { filteredShelfs };
  }, [sections, selectedSectionKey]);

  useEffect(() => {
    const spaceBetweenShelves = filteredShelfs
      .map((item, index, arr) => {
        if (index === 0) return null;
        const fromKey = arr[index - 1];
        return {
          from: fromKey?.key,
          to: item?.key,
          fromPosition: fromKey?.position,
          toPosition: item?.position,
          space: item?.position - fromKey?.position,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.toPosition - a.toPosition)
      .filter((item) => item.from == doorKey);
    if (spaceBetweenShelves.length > 0) {
      const space = spaceBetweenShelves[0]?.space;
      if (space >= 52.5) {
        setIsHeight(true);
      } else {
        setIsHeight(false);
      }
    }
  }, [sections]);
  return (
    <button
      className={`Garderobe_Garderobe__cW0VR Section_garderobe__lck6- Garderobe_height50__7PHv0 Garderobe_metal__HYc6w Garderobe_black__m0wTQ Garderobe_clickable__dBOWm
        ${isHeight ? "show-full-garderobe" : ""} ${
        isWardrobeHighlighted ? "isHighlighted" : ""
      }
        `}
      data-key={doorKey}
      style={{ zIndex: index, top: `${top}` }}
      onClick={() =>
        dispatch(
          setIsWardrobeHighlighted({
            key: doorKey,
            position: top,
          })
        )
      }
    >
      <div className="Garderobe_inner__jbyRf">
        <div className="Garderobe_container__ogs9T">
          <div className="Garderobe_left__V1+UW"></div>
          <div className="Garderobe_middle__6jgqV">
            <div className="Garderobe_middleLeft__E+Xmp"></div>
            <div className="Garderobe_middleCenter__onkch"></div>
          </div>
          <div className="Garderobe_right__26GJ1"></div>
        </div>
        <div className="Garderobe_hangers__9XEB3">
          <div className="Garderobe_hanger__8lbx5"></div>
          <div className="Garderobe_hanger__8lbx5"></div>
        </div>
      </div>
    </button>
  );
};

export default WardrobeRods;
