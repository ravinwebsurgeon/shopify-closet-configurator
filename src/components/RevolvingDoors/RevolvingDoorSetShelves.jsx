import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addShelve,
  deleteShelf,
  updateShelvePostion,
} from "../../slices/shelfDetailSlice";

const RevolvingDoorSetShelves = ({ section }) => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector(
    (state) => state.shelfDetail.racks.selectedSection
  );
  const sections = useSelector(
    (state) => state.shelfDetail.racks.sections[selectedSectionKey]
  );
  const [revolvingDoors, setRevolvingDoor] = useState([]);
  const [shelfsData, setShelfData] = useState([]);
  useEffect(() => {
    if (sections) {
      if (sections?.revolvingDoor) {
        const revolvingDoor = Object.entries(sections?.revolvingDoor).map(
          ([key, value]) => ({
            key,
            type: value?.type,
            position: value?.position,
            height: value?.height,
          })
        );

        setRevolvingDoor(revolvingDoor);
      }
      const shelfDetail = Object.entries(sections?.shelves).map(
        ([key, value]) => ({
          key,
          position: parseFloat(value?.position?.top),
        })
      );
      const shelfPositions = shelfDetail.map((item) => item?.position);
      setShelfData({
        positions: shelfPositions,
        data: shelfDetail,
      });
    }
    // console.log(sections);
  }, [sections]);
  const addOrUpdateShelve = ({ revolvingDoor, position }) => {
    const prevShelfMoveRange = position - 10;
    const newShelfMoveRange = position + 10;
    const findSutiableShelf = shelfsData?.data?.filter(
      (item) =>
        item?.position > prevShelfMoveRange &&
        item?.position < newShelfMoveRange
    );
    if (findSutiableShelf?.length > 1) {
      const key = findSutiableShelf[0]?.key;
      dispatch(
        updateShelvePostion({
          sectionId: selectedSectionKey,
          position: position,
          shelfKey: key,
        })
      );
      findSutiableShelf?.map((item, index) => {
        if (index === 0) return null;
        dispatch(
          deleteShelf({
            sectionId: selectedSectionKey,
            shelfId: item?.key,
          })
        );
      });
    } else if (findSutiableShelf?.length == 1) {
      const key = findSutiableShelf[0]?.key;
      // console.log(key, position);
      dispatch(
        updateShelvePostion({
          sectionId: selectedSectionKey,
          position: position,
          shelfKey: key,
        })
      );
    } else if (findSutiableShelf?.length == 0) {
      const shelfDetail = Object.entries(sections?.shelves).map(
        ([key, value]) => ({
          key,
          position: parseFloat(value?.position?.top),
        })
      );
      let getShelf = shelfDetail?.find((item) => item?.position > position);

      const shelfKeys = Object.keys(sections?.shelves);
      const shelves = sections?.shelves;
      const updatedShelves = {};
      if (!getShelf) {
        getShelf = {
          key: "shelves_" + shelfKeys.length,
        };
      }
      // console.log(getShelf);
      // console.log(shelfKeys.length);
      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];
        const shelf = sections?.shelves[key];
        if (key === getShelf?.key) {
          let drawerIndex = 1;
          let newKey = `shelves_${drawerIndex}`;
          while (shelves[newKey] || updatedShelves[newKey]) {
            drawerIndex++;
            newKey = `shelves_${drawerIndex}`;
          }

          updatedShelves[newKey] = {
            position: { top: position + "em" },
          };
        }
        updatedShelves[key] = shelf;
      }
      dispatch(
        addShelve({
          sectionId: selectedSectionKey,
          shelves: updatedShelves,
        })
      );
    }
  };

  return (
    <div
      className={`shelfRemoveBtnOver scale-90 shelfRemove_bottom${section?.height} shelfRemove_width${section?.width}`}
    >
      {revolvingDoors &&
        revolvingDoors.length > 0 &&
        revolvingDoors.map((item, index) => (
          <React.Fragment key={item?.key + "__" + index}>
            {!shelfsData?.positions.includes(item?.position) && (
              <div
                className="absolute right-[-10px] revolving__doors_set z-[1]"
                style={{ top: item?.position + 4 + "em" }}
              >
                <button
                  onClick={() =>
                    addOrUpdateShelve({
                      revolvingDoor: item,
                      position: item?.position,
                    })
                  }
                  className="bg-white rounded-[2px] h-8 w-8 border border-[#5c5c5c] rightArrow arrow_cstm flex items-center justify-center"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5655 0c0 1.506-1.333 2.7268-2.9772 2.7268 1.6443 0 2.9772 1.2208 2.9772 2.7268 0-1.506 1.333-2.7268 2.9772-2.7268C6.8984 2.7268 5.5655 1.506 5.5655 0ZM13.5615 2.3416c-1.3516-.4655-2.9385-.2054-4.0274.7803-1.1355 1.028-1.3993 2.5462-.7913 3.802l-5.0154 4.54c-.8278-.1765-1.7345.0275-2.38.6119-.9918.8977-.9918 2.3532 0 3.2509.9916.8977 2.5995.8977 3.5912 0 .6197-.561.8522-1.3397.6974-2.0641l5.0546-4.5755c1.3872.5504 3.0645.3116 4.2-.7164 1.0888-.9855 1.3762-2.4219.8621-3.6453l-2.7898 2.5254-1.7851-.3677-.4062-1.616 2.7899-2.5255ZM9.535 12.725c1.6443 0 2.9772-1.2208 2.9772-2.7268 0 1.506 1.333 2.7268 2.9772 2.7268-1.6442 0-2.9772 1.2209-2.9772 2.7268 0-1.5059-1.3329-2.7268-2.9771-2.7268ZM0 7.2714c1.3702 0 2.481-1.0173 2.481-2.2723 0 1.255 1.1108 2.2723 2.481 2.2723-1.3702 0-2.481 1.0174-2.481 2.2724 0-1.255-1.1108-2.2723-2.481-2.2723Z"
                      fill="#F48110"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
            {!shelfsData?.positions.includes(
              item?.position + item?.height - 2.5
            ) && (
              <div
                className="absolute right-[-10px] revolving__doors_set "
                style={{ top: item?.position + item?.height + 4 + "em" }}
              >
                <button
                  onClick={() =>
                    addOrUpdateShelve({
                      revolvingDoor: item,
                      position: item?.position + item?.height,
                    })
                  }
                  className="bg-white rounded-[2px] h-8 w-8 border border-[#5c5c5c] rightArrow arrow_cstm flex items-center justify-center"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.5655 0c0 1.506-1.333 2.7268-2.9772 2.7268 1.6443 0 2.9772 1.2208 2.9772 2.7268 0-1.506 1.333-2.7268 2.9772-2.7268C6.8984 2.7268 5.5655 1.506 5.5655 0ZM13.5615 2.3416c-1.3516-.4655-2.9385-.2054-4.0274.7803-1.1355 1.028-1.3993 2.5462-.7913 3.802l-5.0154 4.54c-.8278-.1765-1.7345.0275-2.38.6119-.9918.8977-.9918 2.3532 0 3.2509.9916.8977 2.5995.8977 3.5912 0 .6197-.561.8522-1.3397.6974-2.0641l5.0546-4.5755c1.3872.5504 3.0645.3116 4.2-.7164 1.0888-.9855 1.3762-2.4219.8621-3.6453l-2.7898 2.5254-1.7851-.3677-.4062-1.616 2.7899-2.5255ZM9.535 12.725c1.6443 0 2.9772-1.2208 2.9772-2.7268 0 1.506 1.333 2.7268 2.9772 2.7268-1.6442 0-2.9772 1.2209-2.9772 2.7268 0-1.5059-1.3329-2.7268-2.9771-2.7268ZM0 7.2714c1.3702 0 2.481-1.0173 2.481-2.2723 0 1.255 1.1108 2.2723 2.481 2.2723-1.3702 0-2.481 1.0174-2.481 2.2724 0-1.255-1.1108-2.2723-2.481-2.2723Z"
                      fill="#F48110"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default RevolvingDoorSetShelves;
