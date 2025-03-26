import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    configuration : null,
    showConfigurator:false,
    options: {
        height: [100, 120, 150, 200, 220, 250, 300],
        width: [55, 70, 85, 100, 115, 130, 155, 170, 200, 230, 255, 260, 270, 285, 300, 355, 390, 400, 500, 600, 700, 800],
        depth: [20, 30, 40, 50, 60, 70, 80],
        shelfCount: [3, 4, 5, 6, 7, 8, 9, 10, 11]
      }
};

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
        }
    }
})


// Export actions
export const {
    setConfiguration,
    setShowConfigurator,
} = shelfDetailSlice.actions;

// export default reducer
export default shelfDetailSlice.reducer