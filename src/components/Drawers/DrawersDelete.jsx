import React from "react";
import DeleteAndConfirm from "../DeleteAndConfirm/DeleteAndConfirm";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCompartment,
  removeDrawer,
  setDrawerHighlighted,
} from "../../slices/shelfDetailSlice";

const DrawersDelete = ({ section, sectionKey }) => {
  const dispatch = useDispatch();
  const highlightedDrawer = useSelector(
    (state) => state.shelfDetail.highlightedDrawer
  );
  const deleteDrawer = (shelfKey, highlightedDrawer) => {
    dispatch(
      removeDrawer({
        sectionId: sectionKey,
        shelfKey: shelfKey,
        drawer: highlightedDrawer,
      })
    );
    close();
  };
  const close = () => {
    dispatch(setDrawerHighlighted(false));
  };
const top = parseFloat(section?.shelves[highlightedDrawer?.shelfkey]?.drawer?.position?.top)
  return (
    <DeleteAndConfirm
      top={(top + 7.5) + 'em'}
      onDelete={() => deleteDrawer(highlightedDrawer?.shelfkey, highlightedDrawer)}
      onConfirm={close}
      section={section}
    />
  );
};

export default DrawersDelete;
