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
  racks: {},
};

const executionObject ={
    "color":"metal",
    "material":"metal",
    "topCaps":"topCaps",
    "braces":"X-braces",
    "feet":"Plastic"
}
const selectedSection = "section_1";
<<<<<<< HEAD
const activeTab = "dimensions";
const createInitialSection = (width, height, shelves) => ({
  width,
  height,
  standHeight: parseInt(height),
  shelves,
});
=======

const activeTab = "dimensions"
const showCounter = true;
const isEditingSides = false;

const createInitialSection  = (width,height,shelves)=>({
    width,
    height,
    shelves
})




>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0

const showCounter = true;
const isEditingSides = false;

const shelfDetailSlice = createSlice({
  name: "shelfDetails",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
<<<<<<< HEAD
=======
      
>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
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
        depth: shelfDepth,
        execution: {
          ...executionObject,
          ...(state.racks.execution || {}),
        },
        selectedSection,
        activeTab,
        showCounter,
<<<<<<< HEAD
        isEditingSides,
=======
        isEditingSides
>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
      };
    },
    updateExecution: (state, action) => {
      state.racks.execution = {
        ...state.racks.execution,
        ...action.payload,
      };
    },
    setCurrSelectedSection: (state, action) => {
      console.log("selected section payload", action.payload);
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
<<<<<<< HEAD
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
=======
    setShowCounter :(state,action) =>{
        state.racks.showCounter = action.payload;
    },
    updateShelvesPosition : (state,action) =>{
      const {sectionId,positionArray} = action.payload;
      const section = state.racks.sections[sectionId];
      if(section){
>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
        const updatedShelves = {};

        positionArray.forEach((position, index) => {
          updatedShelves[`shelves_${index + 1}`] = {
<<<<<<< HEAD
            position,
=======
            position  
>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
          };
        });

        state.racks.sections[sectionId] = {
          ...section,
          shelves: updatedShelves,
        };
<<<<<<< HEAD
      }
    },
    deleteShelf: (state, action) => {
      const { sectionId, shelfId } = action.payload;
      const section = state.racks.sections[sectionId];
      if (section) {
        delete section.shelves[shelfId];
      }
    },
    setEditingSides: (state, action) => {
      state.racks.isEditingSides = action.payload;
    },
=======

      }
    },
    deleteShelf : (state,action) =>{
      const {sectionId,shelfId} = action.payload;
      const section = state.racks.sections[sectionId];
      if(section){
        delete section.shelves[shelfId];
      }
    },
    setEditingSides : (state,action) =>{
      state.racks.isEditingSides = action.payload;
    }

>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
  },
});

// Export actions
export const {
<<<<<<< HEAD
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
  setEditingSides,
=======
    setConfiguration,
    setShowConfigurator,
    setSection,
    updateExecution,
    setCurrSelectedSection,
    deleteSection,
    updateSectionDimensions,
    setActiveTab,
    setShowCounter,
    updateShelvesPosition,
    deleteShelf,
    setEditingSides,
>>>>>>> e857315d31fbb259f33aa3e0f5c08ecf369618c0
} = shelfDetailSlice.actions;

// export default reducer
export default shelfDetailSlice.reducer;