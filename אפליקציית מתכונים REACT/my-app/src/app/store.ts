import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/recipes/recipesSlice';

export const store = configureStore({
  reducer: {
    app: appReducer // חיברנו את המנהל של המתכונים למחסן הראשי
  }
});

// שורות אלו עוזרות ל-TypeScript להכיר את סוג המידע במחסן
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;