import { configureStore } from '@reduxjs/toolkit';
import shelfDetailReducer from '../slices/shelfDetailSlice'
import woodSheflDetailReducer from '../slices/WoodShelfDetailSlice'

export const store = configureStore({
    reducer: {
    shelfDetail : shelfDetailReducer,
    woodShelfDetail: woodSheflDetailReducer
    }
  });