import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { addRecipe, addToShoppingList } from './features/recipes/recipesSlice';

// ייבוא הדפים והרכיבים
import Navbar from './components/Navbar';
import RecipesList from './pages/RecipesList';
import RecipeDetail from './pages/RecipeDetail';
import AddEditRecipe from './pages/AddEditRecipe';
import ShoppingList from './pages/ShoppingList';

const App: React.FC = () => {
  const state = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  // טעינה מה-localStorage בטעינה ראשונה
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes');
    const savedShoppingList = localStorage.getItem('shoppingList');
    
    if (savedRecipes && state.recipes.length === 0) {
      const parsed = JSON.parse(savedRecipes);
      parsed.forEach((r: any) => dispatch(addRecipe(r)));
    }
    
    if (savedShoppingList && state.shoppingList.length === 0) {
      const parsed = JSON.parse(savedShoppingList);
      parsed.forEach((item: any) => dispatch(addToShoppingList(item)));
    }
  }, [dispatch]);

  // שמירה ל-localStorage בכל פעם שה-state משתנה
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(state.recipes));
    localStorage.setItem('shoppingList', JSON.stringify(state.shoppingList));
  }, [state.recipes, state.shoppingList]);

  return (
    <Router>
      <div className="app-container" style={{ direction: 'rtl', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        
        <Navbar /> 

        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<RecipesList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/add" element={<AddEditRecipe />} />
            <Route path="/edit/:id" element={<AddEditRecipe />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;