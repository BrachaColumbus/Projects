//איך נראה מתכון ברשימת המתכונים
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  imageUrl: string | null;
}
//איך נראה פריט ברשימת הקניות
export interface ShoppingItem {
  id: string;
  name: string;
  isBought: boolean;
}
//איך נראה המחסן שלנו
export interface RootState {
  recipes: Recipe[];
  shoppingList: ShoppingItem[];
}