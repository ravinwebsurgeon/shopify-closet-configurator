import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    configuration : null,
    showConfigurator:false,
    options: {
        height: [100, 120, 150, 200, 220, 250, 300],
        width: [55, 70, 85, 100, 115, 130, 155, 170, 200, 230, 255, 260, 270, 285, 300, 355, 390, 400, 500, 600, 700, 800],
        depth: [20, 30, 40, 50, 60, 70, 80],
        shelfCount: [3, 4, 5, 6, 7, 8, 9, 10, 11]
      },
    racks : {}
};

const executionObject ={
    "color":"black",
    "material":"metal",
    "topCaps":"topCaps",
    "braces":"",
    "feet":"Plastic"
}


const createInitialSection  = (width,height,shelves)=>({
    width,
    height,
    shelves
})





const shelfDetailSlice = createSlice({
    name:"shelfDetails",
    initialState,
    reducers:{
        setConfiguration:(state,action) =>{
            state.configuration = action.payload
            state.showConfigurator = true
        },
        setShowConfigurator:(state,action) =>{
            state.showConfigurator = action.payload
        },
        setSection:(state,action) =>{
            const {racksCount, currShelfHeight,shelfDepth,positions} = action.payload;
            const newSection = {}
            const shelves = {}
            positions.forEach((positions,index) =>{
                shelves[`shelves_${index+1}`] = {
                    position :positions
                }
            })
            console.log("Shelves",shelves)

            
            console.log("RackWidths",racksCount)
            const existingSectionCount = state.racks.sections ? Object.keys(state.racks.sections).length : 0;
            racksCount.forEach((width,index)=> {
                newSection[`section_${existingSectionCount+index+1}`] = 
                createInitialSection(width,currShelfHeight,shelves)
            });

            state.racks = { sections: {
                ...state.racks.sections,  
                ...newSection            
            },
                depth:shelfDepth,
                execution:executionObject
            }
        }
    }
})


// Export actions
export const {
    setConfiguration,
    setShowConfigurator,
    setSection
} = shelfDetailSlice.actions;

// export default reducer
export default shelfDetailSlice.reducer