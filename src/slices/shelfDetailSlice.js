import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  configuration: null,
  showConfigurator: false,
  options: {
    height: [100, 120, 150, 200, 220, 250, 300],
    width: [
      55, 70, 85, 100, 115, 130, 155, 170, 200, 230, 255, 260, 270, 285, 300,
      355, 390, 400, 500, 600, 700, 800,
    ],
    depth: [20, 30, 40, 50, 60, 70, 80],
    shelfCount: [3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  selectedSideWall: "",
  selectedBackwall: "",
  racks: {},
  deletedRevDoors: {},
  hideDoor: false,
};

const executionObject = {
  color: "metal",
  material: "metal",
  topCaps: "topCaps",
  braces: "X-braces",
  feet: "Plastic",
};

const sideWallObject = {
  left: {
    isLeft: false,
    type: "",
    height: "",
  },
  right: {
    isRight: false,
    type: "",
    height: "",
  },
};

const backwallObject = {
  type: "",
  height: "",
};

const selectedSection = "section_1";
const activeTab = "dimensions";
const createInitialSection = (width, height, shelves) => ({
  width: Number(width),
  height: Number(height),
  standHeight: parseInt(height),
  shelves,
  sideWall: sideWallObject,
  backWall: backwallObject,
});

const showCounter = true;
const isEditingSides = false;
const isEditingBackwall = false;

const shelfDetailSlice = createSlice({
  name: "shelfDetails",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.racks.activeTab = action.payload;
    },
    setConfiguration: (state, action) => {
      state.configuration = action.payload;
      state.showConfigurator = true;
    },
    setShowConfigurator: (state, action) => {
      state.showConfigurator = action.payload;
    },
    setSection: (state, action) => {
      const { racksCount, currShelfHeight, shelfDepth, positions } =
        action.payload;
      const newSection = {};
      const shelves = {};
      positions.forEach((positions, index) => {
        shelves[`shelves_${index + 1}`] = {
          position: positions,
        };
      });

      // const existingSectionCount = state.racks.sections ? Object.keys(state.racks.sections).length : 0;
      // racksCount.forEach((width,index)=> {
      //     newSection[`section_${existingSectionCount+index+1}`] =
      //     createInitialSection(width,currShelfHeight,shelves)
      // });

      // Get the highest section number
      const sectionNumbers = Object.keys(state.racks.sections || {})
        .map((key) => parseInt(key.replace("section_", ""), 10))
        .filter((num) => !isNaN(num));

      const highestSectionNumber =
        sectionNumbers.length > 0 ? Math.max(...sectionNumbers) : 0;

      // Assign new sections starting from the highest section number + 1
      racksCount.forEach((width, index) => {
        newSection[`section_${highestSectionNumber + index + 1}`] =
          createInitialSection(width, currShelfHeight, shelves);
      });

      state.racks = {
        sections: {
          ...state.racks.sections,
          ...newSection,
        },
        depth: Number(shelfDepth),
        execution: {
          ...executionObject,
          ...(state.racks.execution || {}),
        },
        selectedSection,
        activeTab,
        showCounter,
        isEditingSides,
        isEditingBackwall,
      };
    },
    updateExecution: (state, action) => {
      state.racks.execution = {
        ...state.racks.execution,
        ...action.payload,
      };
    },
    setCurrSelectedSection: (state, action) => {
      state.racks.selectedSection = action.payload;
    },
    deleteSection: (state, action) => {
      const sectionKey = action.payload;
      if (state.racks.sections[sectionKey]) {
        delete state.racks.sections[sectionKey];
      }
    },
    updateSectionDimensions: (state, action) => {
      const { sectionId, dimension, value, positions } = action.payload;
      if (dimension === "depth") {
        state.racks.depth = value;
        if (value <= 20) {
          const shelves = state.racks.sections[sectionId].shelves;
          const shelfKeys = Object.keys(shelves).sort((a, b) => {
            return (
              parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10)
            );
          });

          shelfKeys.forEach((key) => {
            if (key.startsWith("compartment_")) {
              delete shelves[key];
            }
          });
        }
      } else if (state.racks.sections && state.racks.sections[sectionId]) {
        state.racks.sections[sectionId][dimension] = value;
        if (dimension === "height" && positions) {
          state.racks.sections[sectionId].shelves = {};
          positions.forEach((position, index) => {
            state.racks.sections[sectionId].shelves[`shelves_${index + 1}`] = {
              position: position,
            };
          });
        }
      }
    },
    updateLastShelvePostion: (state, action) => {
      const { sectionId, positions } = action.payload;

      if (positions?.length > 0) {
        const shelves = state.racks.sections[sectionId].shelves;
        const shelfKeys = Object.keys(shelves).sort((a, b) => {
          return parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10);
        });

        if (shelfKeys.length > 0) {
          const lastShelfKey = shelfKeys[shelfKeys.length - 1];
          shelves[lastShelfKey] = {
            ...shelves[lastShelfKey],
            position: positions[positions.length - 1],
          };
        }
      }
    },
    setShowCounter: (state, action) => {
      state.racks.showCounter = action.payload;
    },
    updateShelvesPosition: (state, action) => {
      const { sectionId, positionArray } = action.payload;
      const section = state.racks.sections[sectionId];
      if (section) {
        const updatedShelves = {};

        positionArray.forEach((position, index) => {
          updatedShelves[`shelves_${index + 1}`] = {
            position,
          };
        });

        state.racks.sections[sectionId] = {
          ...section,
          shelves: updatedShelves,
        };
      }
    },
    deleteShelf: (state, action) => {
      const { sectionId, shelfId } = action.payload;
      const section = state.racks.sections[sectionId];
      const shelfKeys = Object.keys(section.shelves);
      const index = shelfKeys.indexOf(shelfId);
      if (index > 0) {
        const prevKey = shelfKeys[index - 1];
        if (prevKey.includes("compartment_")) {
          delete section.shelves[prevKey];
        }
      }
      if (section) {
        delete section.shelves[shelfId];
      }
    },
    setEditingSides: (state, action) => {
      state.racks.isEditingSides = action.payload;
    },
    setEditingBackwall: (state, action) => {
      state.racks.isEditingBackwall = action.payload;
    },
    updateShelvePostion: (state, action) => {
      const { sectionId, position, shelfKey } = action.payload;
      if (position >= 0) {
        const shelves = state.racks.sections[sectionId].shelves;
        const shelfKeys = Object.keys(shelves).sort((a, b) => {
          return parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10);
        });

        if (shelfKeys.length > 0) {
          shelves[shelfKey] = {
            ...shelves[shelfKey],
            position: { ...shelves[shelfKey].position, top: position + "em" },
          };
        }
      }
    },
    setCurrSideWall: (state, action) => {
      state.selectedSideWall = action.payload;
    },
    updateSideWall: (state, action) => {
      const { sectionId, side, type, height } = action.payload;
      if (state.racks.sections[sectionId]) {
        state.racks.sections[sectionId].sideWall[side] = {
          ...(state.racks.sections[sectionId].sideWall[side] || {}),
          isLeft: side === "left",
          isRight: side === "right",
          type,
          height,
        };
      }
    },
    updateShelveIndexAndPostion: (state, action) => {
      const { sectionId, shelves } = action.payload;
      if (shelves.length > 0) {
        const newShelves = state.racks.sections[sectionId].shelves;

        shelves.map((item, index) => {
          newShelves[item.key] = {
            ...shelves[item.key],
            position: { zIndex: shelves.length - index, top: item.top + "em" },
          };
        });
      }
    },
    deleteSideWall: (state, action) => {
      const { sectionId, side } = action.payload;
      if (state.racks.sections[sectionId]) {
        state.racks.sections[sectionId].sideWall[side] = {
          isLeft:
            side == "left"
              ? false
              : state.racks.sections[sectionId].sideWall.left.isLeft,
          isRight:
            side == "right"
              ? false
              : state.racks.sections[sectionId].sideWall.right.isRight,
          type: "",
          height: "",
        };
      }
    },
    setCurrBackwall: (state, action) => {
      state.selectedBackwall = action.payload;
    },
    updateBackwall: (state, action) => {
      const { sectionId, type, height } = action.payload;
      if (state.racks.sections[sectionId]) {
        state.racks.sections[sectionId].backWall = {
          ...(state.racks.sections[sectionId].backWall || {}),
          type,
          height,
        };
      }
    },
    deleteBackwall: (state, action) => {
      const { sectionId } = action.payload;
      if (state.racks.sections[sectionId]) {
        state.racks.sections[sectionId].backWall = {
          type: "",
          height: "",
        };
      }
    },
    addCompartment: (state, action) => {
      const { sectionId, shelfKey, compartmentType, compartmentCount } =
        action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};

      const isSliding = compartmentType === "sliding_partition";
      const targetShelf = shelves[shelfKey];

      if (isSliding && targetShelf?.compartments) {
        targetShelf.compartments.count = compartmentCount || 0;
        return;
      }

      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];
        const shelf = shelves[key];

        if (key === shelfKey && !shelf?.compartments) {
          updatedShelves[`compartment_${i + 1}`] = {
            compartments: {
              type: compartmentType,
              position: { top: shelf.position.top },
              count: compartmentCount || null,
            },
          };
        }

        updatedShelves[key] = shelf;
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },

    updateCompartmentPostion: (state, action) => {
      const {
        sectionId,
        shelfKey,
        selectedKey,
        compartmentType,
        compartmentCount,
      } = action.payload;

      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves) {
        delete shelves[selectedKey];
      }
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};
      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];

        if (key === shelfKey && !shelves[shelfKey]?.compartments) {
          const newShelf = {
            compartments: {
              type: compartmentType,
              position: {
                top: shelves[shelfKey].position.top,
              },
              count: compartmentCount || null,
            },
          };
          state.isCompartmentHighlighted = {
            shelfkey: `compartment_${i + 1}`,
            compartmentType: compartmentType,
            count: compartmentCount,
          };
          updatedShelves[`compartment_${i + 1}`] = newShelf;
        }

        updatedShelves[key] = shelves[key];
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },
    removeCompartment: (state, action) => {
      const { sectionId, shelfKey, compartment } = action.payload;
      const shelves = state.racks.sections?.[sectionId]?.shelves;

      if (!shelves || !compartment) return;

      const { compartmentType, shelfkey } = compartment;

      if (compartmentType === "sliding_partition") {
        const targetShelf = shelves[shelfkey];
        if (targetShelf?.compartments?.count > 0) {
          targetShelf.compartments.count -= 1;
        }
      } else {
        delete shelves[shelfKey];
      }
    },
    setCompartmentHighlighted: (state, action) => {
      state.isCompartmentHighlighted = action.payload;
    },
    addDrawer: (state, action) => {
      const { sectionId, shelfKey, top } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};

      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];
        const shelf = shelves[key];
        console.log(top);
        if (key === shelfKey) {
          let drawerIndex = 1;
          let newKey = `drawer_${drawerIndex}`;
          while (shelves[newKey] || updatedShelves[newKey]) {
            drawerIndex++;
            newKey = `drawer_${drawerIndex}`;
          }

          updatedShelves[newKey] = {
            drawer: {
              position: { top: top + "em" },
            },
          };
        }

        updatedShelves[key] = shelf;
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },
    updateDrawerPosition: (state, action) => {
      const { sectionId, shelfKey, top, jump } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};
      if (shelves && shelves[shelfKey] && shelves[shelfKey].drawer) {
        shelves[shelfKey].drawer.position.top = top + "em";
      }
      if (jump) {
        const newArray = [];
        shelfKeys.map((item) => {
          const top =
            shelves[item]?.drawer?.position.top ||
            shelves[item]?.compartments?.position?.top ||
            shelves[item].position.top;
          newArray.push({
            item: { ...shelves[item] },
            top: parseFloat(top),
          });
        });
        let current = { shelfKey: shelfKey, top: top };
        const sortedArray = newArray.sort((a, b) => a.top - b.top);
        sortedArray.map((item, index) => {
          console.log(item);
          let key = `shelves_${index + 1}`;
          if (item?.item?.drawer) {
            key = `drawer_${index + 1}`;
          }
          if (item?.item?.compartments) {
            key = `compartment_${index + 1}`;
          }
          if (item?.top == top) {
            if (current) {
              current.shelfKey = key;
            }
          }
          updatedShelves[key] = item?.item;
        });
        state.racks.sections[sectionId].shelves = updatedShelves;
        state.highlightedDrawer = {
          shelfkey: current.shelfKey,
          top: current.top,
        };        
      }
    },
    removeDrawer: (state, action) => {
      const { sectionId, shelfKey } = action.payload;
      const shelves = state.racks.sections?.[sectionId]?.shelves;
      delete shelves[shelfKey];
    },
    setDrawerHighlighted: (state, action) => {
      state.highlightedDrawer = action.payload;
    },
    setProductInfoModalContent: (state, action) => {
      state.productInformation = action.payload;
    },
    setOpenModal: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setWardrobeRod: (state, action) => {
      const { sectionId, shelfKey, position } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves).sort((a, b) => {
        return parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10);
      });

      if (shelfKeys.includes(shelfKey)) {
        shelves[shelfKey] = {
          ...shelves[shelfKey],
          wardrobeRod: {
            position,
          },
        };
      }
    },
    addRevolvingDoor: (state, action) => {
      const { sectionId, doorKey, type, position, height } = action.payload;

      if (!state.racks.sections[sectionId]) return;

      if (!state.racks.sections[sectionId].revolvingDoor) {
        state.racks.sections[sectionId].revolvingDoor = {};
      }

      state.racks.sections[sectionId].revolvingDoor[doorKey] = {
        type,
        position,
        height,
      };
    },
    updateRevolvingDoor: (state, action) => {
      const { sectionId, doorKey, position } = action.payload;

      if (!state.racks.sections[sectionId]) return;

      if (!state.racks.sections[sectionId].revolvingDoor) {
        state.racks.sections[sectionId].revolvingDoor = {};
      }

      if (state.racks.sections[sectionId].revolvingDoor[doorKey]) {
        state.racks.sections[sectionId].revolvingDoor[doorKey].position =
          position;
      }
    },
    removeRevolvingDoor: (state, action) => {
      const { sectionId, doorKey } = action.payload;

      if (
        state.racks.sections[sectionId] &&
        state.racks.sections[sectionId].revolvingDoor &&
        state.racks.sections[sectionId].revolvingDoor[doorKey]
      ) {
        delete state.racks.sections[sectionId].revolvingDoor[doorKey];
      }
    },
    setisRevolvingDoorHighlighted: (state, action) => {
      state.isRevolvingDoorHighlighted = action.payload;
    },
    storeDeletedRevDoor: (state, action) => {
      const { sectionId, doorKey, position, height } = action.payload;
      if (!state.deletedRevDoors[sectionId]) {
        state.deletedRevDoors[sectionId] = {};
      }
      state.deletedRevDoors[sectionId][doorKey] = { position, height };
    },
    removeDeletedDoor: (state, action) => {
      const { sectionId, doorKey } = action.payload;
      if (state.deletedRevDoors[sectionId]) {
        delete state.deletedRevDoors[sectionId][doorKey];
      }
    },
    setHideDoor: (state, action) => {
      state.hideDoor = action.payload;
    },
  },
});

// Export actions
export const {
  setConfiguration,
  setShowConfigurator,
  setSection,
  updateExecution,
  setCurrSelectedSection,
  deleteSection,
  updateSectionDimensions,
  updateLastShelvePostion,
  setActiveTab,
  setShowCounter,
  updateShelvesPosition,
  deleteShelf,
  updateShelvePostion,
  updateShelveIndexAndPostion,
  setEditingSides,
  setEditingBackwall,
  updateSideWall,
  setCurrSideWall,
  deleteSideWall,
  setCurrBackwall,
  updateBackwall,
  deleteBackwall,
  addCompartment,
  setCompartmentHighlighted,
  removeCompartment,
  setProductInfoModalContent,
  setOpenModal,
  updateCompartmentPostion,
  addDrawer,
  setDrawerHighlighted,
  removeDrawer,
  updateDrawerPosition,
  setWardrobeRod,
  addRevolvingDoor,
  setisRevolvingDoorHighlighted,
  removeRevolvingDoor,
  storeDeletedRevDoor,
  removeDeletedDoor,
  setHideDoor,
  updateRevolvingDoor
} = shelfDetailSlice.actions;

// export default reducer
export default shelfDetailSlice.reducer;
