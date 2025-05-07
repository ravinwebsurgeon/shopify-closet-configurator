import { createSlice } from "@reduxjs/toolkit";
import cryptoRandomString from "crypto-random-string";

const initialState = {
  configuration: null,
  priceData: null,
  isDeleteModalOpen:false,
  showConfigurator: false,
  options: {
    height: [100, 120, 150,180, 200, 220, 250, 300, 350],
    width: [
      55, 70, 85, 100, 115, 130, 155, 170, 200, 230, 255, 260, 270, 285, 300,
      355, 390, 400, 500, 600, 700, 800, 900, 1000,
    ],
    depth: [20, 30, 40, 50, 60, 70, 80, 100],
    shelfCount: [3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  selectedSideWall: "",
  selectedBackwall: "",
  racks: {},
  deletedRevDoors: {},
  hideDoor: false,
  sidewallSelected: "",
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
    resetState : (state) =>{
      return initialState;
    },
    openDeleteModal:(state,action)=>{
      state.isDeleteModalOpen = action.payload;
    },
    setAPIData: (state, action) => {
      state.priceData = action.payload;
    },
    setSidewallSelected: (state, action) => {
      state.sidewallSelected = action.payload;
    },
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
    setDefault: (state, action) => {
      state.racks = action.payload;
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

      const newSectionKey = Object.keys(newSection);

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
        selectedSection: newSectionKey[0],
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
        if (value <= 20 ) {
          const shelves = state.racks.sections[sectionId].shelves;
          const shelfKeys = Object.keys(shelves).sort((a, b) => {
            return (
              parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10)
            );
          });

          shelfKeys.forEach((key) => {
            const item = shelves[key];

            if (
              key.startsWith("compartment_") &&
              item?.compartments?.type == "compartment_divider_set" ||
              item?.compartments?.type == "sliding_partition"
            ) {
              delete shelves[key];
            }
          });
        } else if (value > 80) {
          const shelves = state.racks.sections[sectionId].shelves;
          const shelfKeys = Object.keys(shelves).sort((a, b) => {
            return (
              parseInt(a.split("_")[1], 10) - parseInt(b.split("_")[1], 10)
            );
          });

          shelfKeys.forEach((key) => {
            const item = shelves[key];

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
      const { sectionId, positions, dimension, value } = action.payload;
      const height = state.racks.sections[sectionId].height;
      const heightArr = {
        90: "52",
        100: "57",
        120: "67",
        150: "82",
        180: "97",
        200: "107",
        210: "112",
        220: "117",
        240: "127",
        250: "132",
        300: "157",
        350: "182",
      };
      if (positions?.length > 0) {
        const shelves = state.racks.sections[sectionId].shelves;
        const shelfKeys = Object.keys(shelves);

        if (shelfKeys.length > 0) {
          const lastShelfKey = shelfKeys[shelfKeys.length - 1];
          const prevShelfKey = shelfKeys[shelfKeys.length - 2];
          if (prevShelfKey.includes("compartment_")) {
            shelves[prevShelfKey] = {
              ...shelves[prevShelfKey],
              compartments: {
                ...shelves[prevShelfKey]?.compartments,
                position: positions[positions.length - 1],
              },
            };
          }
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
        //
        // const existingShelves = section.shelves;

        // Object.entries(existingShelves).forEach(([key, value]) => {
        //   if (key.startsWith('shelves')) {
        //     updatedShelves[key] = value;
        //   }
        // });

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

      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves && shelves[doorKey] && shelves[doorKey]?.position) {
        shelves[doorKey].position = position;
      }
    },
    removeRevolvingDoor: (state, action) => {
      const { sectionId, doorKey } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves && shelves[doorKey]) {
        delete shelves[doorKey];
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
    removeSectionDoors: (state, action) => {
      const { sectionId } = action.payload;
      const section = state.racks.sections[sectionId];
      if (
        section?.revolvingDoor &&
        Object.keys(section.revolvingDoor).length > 0
      ) {
        section.revolvingDoor = {};
      }
    },
    addShelve: (state, action) => {
      const { sectionId, shelves } = action.payload;
      state.racks.sections[sectionId].shelves = shelves;
    },
    updateSlidingDoor: (state, action) => {
      const { sectionId, position, doorKey } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves && shelves[doorKey] && shelves[doorKey]?.position) {
        shelves[doorKey].position = position;
      }
    },
    addSlidingDoor: (state, action) => {
      const randomstr = cryptoRandomString({ length: 7, type: "alphanumeric" });
      const { sectionId, type, position, shelfKey } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};
      if (!state.racks.sections[sectionId]) return;
      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];
        const shelf = shelves[key];
        if (key === shelfKey) {
          state.isSlidingDoorHighlighted = {
            id: `slidingDoors_${randomstr}`,
            type: type,
            position: position,
          };
          updatedShelves[`slidingDoors_${randomstr}`] = {
            type: type,
            position: position,
          };
        }

        updatedShelves[key] = shelf;
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },
    setSlidingDoorHighlighted: (state, action) => {
      state.isSlidingDoorHighlighted = action.payload;
    },
    removeSlidingDoor: (state, action) => {
      const { sectionId, doorKey } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves && shelves[doorKey]) {
        delete shelves[doorKey];
      }
    },
    removeDrawersFromSection: (state, action) => {
      const { sectionId } = action.payload;
      const shelves = state.racks.sections?.[sectionId]?.shelves;
      if (!shelves) return;
      Object.keys(shelves).forEach((key) => {
        if (key.startsWith("drawer_")) {
          delete shelves[key];
        }
      });
    },
    addRevloDoor: (state, action) => {
      const randomstr = cryptoRandomString({ length: 7, type: "alphanumeric" });
      const { sectionId, type, position, shelfKey, height, shelfType } =
        action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const c = shelfType != "notItem" ? 0 : 1;
      const updatedShelves = {};
      if (!state.racks.sections[sectionId]) return;
      for (let i = 0; i < shelfKeys.length + c; i++) {
        const key = shelfKeys[i];
        const shelf = shelves[key];
        if (shelfType != "notItem") {
          if (key === shelfKey) {
            state.isRevolvingDoorHighlighted = {
              id: `revolvingDoors_${randomstr}`,
              type: type,
              position: position,
              height: height,
            };
            updatedShelves[`revolvingDoors_${randomstr}`] = {
              type: type,
              position: position,
              height: height,
            };
          }
          updatedShelves[key] = shelf;
        } else {
          if (!key) {
            state.isRevolvingDoorHighlighted = {
              id: `revolvingDoors_${randomstr}`,
              type: type,
              position: position,
              height: height,
            };
            updatedShelves[`revolvingDoors_${randomstr}`] = {
              type: type,
              position: position,
              height: height,
            };
          } else {
            updatedShelves[key] = shelf;
          }
        }
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },
    addWardrobe: (state, action) => {
      const { sectionId, shelfKey, top } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};

      for (let i = 0; i < shelfKeys.length; i++) {
        const key = shelfKeys[i];
        const shelf = shelves[key];
        if (key === shelfKey) {
          let wardrobeIndex = 1;
          let newKey = `wardrobe_${wardrobeIndex}`;
          while (shelves[newKey] || updatedShelves[newKey]) {
            wardrobeIndex++;
            newKey = `wardrobe_${wardrobeIndex}`;
          }
          state.isWardrobeHighlighted = {
            key: newKey,
            position: top,
          };
          updatedShelves[newKey] = {
            position: { top: top + "em" },
          };
        }

        updatedShelves[key] = shelf;
      }

      state.racks.sections[sectionId].shelves = updatedShelves;
    },
    setIsWardrobeHighlighted: (state, action) => {
      state.isWardrobeHighlighted = action.payload;
    },
    updateWardrobePosition: (state, action) => {
      const { sectionId, shelfKey, top, jump } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      const shelfKeys = Object.keys(shelves);
      const updatedShelves = {};
      if (shelves && shelves[shelfKey]) {
        shelves[shelfKey].position.top = top + "em";
      }
      // if (jump) {
      //   const newArray = [];
      //   shelfKeys.map((item) => {
      //     const top =
      //       shelves[item]?.drawer?.position.top ||
      //       shelves[item]?.compartments?.position?.top ||
      //       shelves[item].position.top;
      //     newArray.push({
      //       item: { ...shelves[item] },
      //       top: parseFloat(top),
      //     });
      //   });
      //   let current = { shelfKey: shelfKey, top: top };
      //   const sortedArray = newArray.sort((a, b) => a.top - b.top);
      //   sortedArray.map((item, index) => {
      //     let key = `shelves_${index + 1}`;
      //     if (item?.item?.drawer) {
      //       key = `drawer_${index + 1}`;
      //     }
      //     if (item?.item?.compartments) {
      //       key = `compartment_${index + 1}`;
      //     }
      //     if (item?.top == top) {
      //       if (current) {
      //         current.shelfKey = key;
      //       }
      //     }
      //     updatedShelves[key] = item?.item;
      //   });
      //   state.racks.sections[sectionId].shelves = updatedShelves;
      //   state.highlightedDrawer = {
      //     shelfkey: current.shelfKey,
      //     top: current.top,
      //   };
      // }
    },
    removeAllWardrobeRods: (state, action) => {
      const { sectionId } = action.payload;
      const shelves = state.racks.sections[sectionId].shelves;
      if (shelves) {
        Object.keys(shelves).forEach((key) => {
          if (key.startsWith("wardrobe_")) {
            delete shelves[key];
          }
        });
      }
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
  updateRevolvingDoor,
  removeSectionDoors,
  addShelve,
  setSlidingDoorHighlighted,
  addSlidingDoor,
  removeSlidingDoor,
  removeDrawersFromSection,
  updateSlidingDoor,
  addRevloDoor,
  addWardrobe,
  setIsWardrobeHighlighted,
  updateWardrobePosition,
  setAPIData,
  setSidewallSelected,
  resetState,
  setDefault,
  removeAllWardrobeRods,
  openDeleteModal
} = shelfDetailSlice.actions;

// export default reducer
export default shelfDetailSlice.reducer;
