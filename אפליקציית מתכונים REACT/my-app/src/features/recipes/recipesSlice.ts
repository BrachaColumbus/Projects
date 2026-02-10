import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, ShoppingItem } from './recipeTypes';
// פה מגדירים שבתוך המחסן יהיה 2 מדפים
//  אחד של מתכונים ואחד של רשימות קניות:
interface AppState {
  recipes: Recipe[];
  shoppingList: ShoppingItem[];
}
//המצב הראשוני של המדפים הוא ריק
const initialState: AppState = {
  recipes: [],
  shoppingList: []
};
//יוצרים את ההוראות מה אפשר לעשות במחסן
const recipesSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // --- פעולות מתכונים ---
    //הוספת מתכון
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
    },
    //מחיקת מתכון
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(r => r.id !== action.payload);
    },
    //עריכת מתקון קיים
        updateRecipe: (state, action) => {
    const index = state.recipes.findIndex(r => r.id === action.payload.id);
    if (index !== -1) {
      state.recipes[index] = action.payload; // מעדכן את המתכון הקיים בנתונים החדשים
    }
  },

    // --- פעולות רשימת קניות ---
    
    // הפונקציה שהייתה חסרה: מוסיפה פריט חדש לרשימת הקניות
    addToShoppingList: (state, action: PayloadAction<ShoppingItem>) => {
      state.shoppingList.push(action.payload);
    },

    // מחיקת פריט בודד מרשימת הקניות
    removeFromShoppingList: (state, action: PayloadAction<string>) => {
      state.shoppingList = state.shoppingList.filter(item => item.id !== action.payload);
    },

    // סימון פריט כנקנה/לא נקנה (Toggle)
    toggleItemStatus: (state, action: PayloadAction<string>) => {
      const item = state.shoppingList.find(i => i.id === action.payload);
      if (item) {
        item.isBought = !item.isBought;
      }
    },

    // ניקוי כל רשימת הקניות
    clearShoppingList: (state) => {
      state.shoppingList = [];
    },
}});

// ייצוא של כל הפעולות כדי שנוכל להשתמש בהן בדפים
export const { 
  addRecipe, 
  updateRecipe,
  deleteRecipe, 
  addToShoppingList, 
  removeFromShoppingList, 
  toggleItemStatus, 
  clearShoppingList 
} = recipesSlice.actions;

export default recipesSlice.reducer;