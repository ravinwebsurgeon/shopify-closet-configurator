import { configureStore } from '@reduxjs/toolkit';
import shelfDetailReducer from '../slices/shelfDetailSlice'

export const store = configureStore({
    reducer: {
      
    //   clientDetails: clientDetailsReducer,
    shelfDetail : shelfDetailReducer
      
    }
  });