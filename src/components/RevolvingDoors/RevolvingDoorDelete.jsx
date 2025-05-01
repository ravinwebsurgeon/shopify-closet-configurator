import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeRevolvingDoor,
  setisRevolvingDoorHighlighted,
} from "../../slices/shelfDetailSlice";

const RevolvingDoorDelete = ({ section, door }) => {
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
    dispatch(setisRevolvingDoorHighlighted(false));
  };

  const closeRevDoor = () => {
    dispatch(setisRevolvingDoorHighlighted(false));
  };

  return (
    <DeleteAndConfirm
      top={`${door.position + 12.5}em`}
      onDelete={() =>
        deleteRevDoor({ sectionId: selectedSection, doorKey: door?.id })
      }
      onConfirm={closeRevDoor}
      section={section}
    />
  );
};

export default RevolvingDoorDelete;
