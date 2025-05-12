import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRevolvingDoor,
  setIsWardrobeHighlighted,
} from "../../slices/shelfDetailSlice";

const WardrobeRodsDelete = ({ section, door }) => {
  const top = parseFloat(door.position);
  const dispatch = useDispatch();
  const selectedSection = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const deleteRevDoor = ({ sectionId, doorKey }) => {
    dispatch(
      removeRevolvingDoor({
        sectionId,
        doorKey,
      })
    );
    dispatch(setIsWardrobeHighlighted(false));
  };

  const closeRevDoor = () => {
    dispatch(setIsWardrobeHighlighted(false));
  };

  return (
    <DeleteAndConfirm
      top={`${top - 4}em`}
      onDelete={() =>
        deleteRevDoor({
          sectionId: selectedSection,
          doorKey: door?.key,
        })
      }
      onConfirm={closeRevDoor}
      section={section}
    />
  );
};

export default WardrobeRodsDelete;
