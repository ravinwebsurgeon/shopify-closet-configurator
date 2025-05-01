import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  configuration: { height: 90, width: 60, depth: 30, shelves: 2 },
  showConfigurator: true,
  options: {
    height: [90, 150, 180, 210, 240, 300],
    width: [60, 75, 100, 120],
    depth: [30, 40, 50, 60],
  },
  selectedSideWall: "",
  racks: {},
};

const selectedSection = "section_1";
const activeTab = "dimensions";
let showCounter = true;

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

const createInitialSection = (width, height, shelves) => ({
  width: Number(width),
  height: Number(height),
  standHeight: parseInt(height),
  shelves,
  sideWall: sideWallObject,
  backWall: backwallObject,
});

const woodShelfDetailSlice = createSlice({
  name: "woodShelfDetails",
  initialState,
  reducers: {
    setWoodSection: (state, action) => {
      const { racksCount, currShelfHeight, shelfDepth, positions, fromSelect } =
        action.payload;
      const newSection = {};
      const shelves = {};

      const existingSections = Object.keys(state.racks.sections || {}).length;

      if (fromSelect && existingSections > 0) {
        return;
      }

      positions.forEach((positions, index) => {
        shelves[`shelves_${index + 1}`] = {
          position: positions,
        };
      });
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

      const newSectionKey = Object.keys(newSection);

      state.racks = {
        sections: {
          ...state.racks.sections,
          ...newSection,
        },
        depth: Number(shelfDepth),
        selectedSection: newSectionKey[0],
        activeTab,
        showCounter,
        // isEditingSides,
        // isEditingBackwall,
      };
    },
    updateWoodSectionDimensions: (state, action) => {
      const { sectionId, dimension, value, positions } = action.payload;
      if (state.racks.sections && state.racks.sections[sectionId]) {
        if(dimension == "depth"){
            state.racks.depth = value;
        }
        else{
            state.racks.sections[sectionId][dimension] = value;
        }
        
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
    setCurrSelectedWoodSection: (state, action) => {
        state.racks.selectedSection = action.payload;
      },
    deleteWoodSection: (state, action) => {
      const sectionKey = action.payload;
      if (state.racks.sections[sectionKey]) {
        delete state.racks.sections[sectionKey];
      }
    },
    updateLastWoodShelvePostion: (state, action) => {
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
      setWoodShowCounter: (state, action) => {
        state.racks.showCounter = action.payload;
      },
      updateWoodShelvesPosition: (state, action) => {
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
      setWoodActiveTab: (state, action) => {
        state.racks.activeTab = action.payload;
      },
      deleteWoodShelf: (state, action) => {
        const { sectionId, shelfId } = action.payload;
        const section = state.racks.sections[sectionId];
        if (section) {
          delete section.shelves[shelfId];
        }
      },
      updateWoodShelvePostion: (state, action) => {
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
      updateWoodShelveIndexAndPostion: (state, action) => {
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
  },
});

export const {
  setWoodSection,
  updateWoodSectionDimensions,
  setCurrSelectedWoodSection,
  deleteWoodSection,
  updateLastWoodShelvePostion,
  setWoodShowCounter,
  updateWoodShelvesPosition,
  setWoodActiveTab,
  deleteWoodShelf,
  updateWoodShelvePostion,
  updateWoodShelveIndexAndPostion
} = woodShelfDetailSlice.actions;

// export default reducer
export default woodShelfDetailSlice.reducer;
