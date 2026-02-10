import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { addToShoppingList } from '../features/recipes/recipesSlice';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
//מוצא מתכון לפי ה ID
  const recipe = useSelector((state: RootState) => 
    state.app.recipes.find(r => r.id === id)
  );

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'white', fontFamily: 'Assistant' }}>
        <h2>המתכון לא נמצא</h2>
        <button onClick={() => navigate('/')}>חזור לרשימה</button>
      </div>
    );
  }
// פונקציות להוספת מצרך לרשימת הקניות
  const handleAddOne = (ingredient: string, index: number) => {
    dispatch(addToShoppingList({
      id: Date.now().toString() + Math.random(),
      name: ingredient,
      isBought: false
    }));
    setClickedId(index.toString());//מסמן את הכפתור שנלחץ
    setTimeout(() => setClickedId(null), 300);// מאפס את הסימון אחרי 300 מ״ש
  };
// פונקציה להוספת כל המצרכים לרשימת הקניות
  const handleAddAll = () => {
    recipe.ingredients.forEach((ing, index) => handleAddOne(ing, index));
    alert("כל המרכיבים נוספו לרשימת הקניות!");
  };
//עיצוב כפתור הפלוס לפי מצב 
  const getPlusButtonStyle = (index: number): React.CSSProperties => {
    const isClicked = clickedId === index.toString();
    const isHovered = hoveredId === index.toString();
    return {
      width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold', transition: 'all 0.2s ease', fontSize: '1.2rem',
      border: isClicked ? '1px solid #28a745' : '1px solid #c5a059',
      backgroundColor: isClicked ? '#28a745' : (isHovered ? '#c5a059' : '#fff'),
      color: isClicked || isHovered ? '#fff' : '#c5a059',
      transform: isClicked ? 'scale(0.85)' : (isHovered ? 'scale(1.1)' : 'scale(1)'),
    };
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%', 
      direction: 'rtl', 
      fontFamily: "'Assistant', sans-serif",
      backgroundColor: '#000' // צבע גיבוי למקרה שהתמונה נטענת
    }}>
      
  {/* שכבת הרקע עם טשטוש */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${recipe.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(6px) brightness(0.4)',
        zIndex: 0,
        transform: 'scale(1.1)' 
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px' }}>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* כפתורי ניווט ועריכה */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem', padding: '10px 20px', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
              ← חזרה למתכונים
            </button>
            
            <button 
              onClick={() => navigate(`/edit/${recipe.id}`)}
              style={{ padding: '10px 25px', backgroundColor: '#fff', border: 'none', color: '#1a1a1a', cursor: 'pointer', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              ✎ עריכת מתכון
            </button>
          </div>

          {/* כותרת */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-block' }}>
              <h1 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '4rem', 
                margin: '0', 
                color: '#fff', 
                paddingBottom: '15px',
                textShadow: '0 4px 20px rgba(0,0,0,0.8)' // צל חזק כדי לקרוא על הרקע
              }}>
                {recipe.title}
              </h1>
              <div style={{ width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, #c5a059, transparent)' }}></div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
            
            {/* כרטיס מצרכים */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: '28px', padding: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c5a059', marginBottom: '25px', textAlign: 'center', display: 'block', fontWeight: 'bold' }}>המצרכים</span>
              
              <button 
                onClick={handleAddAll} 
                style={{ width: '100%', padding: '15px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold' }}
              >
                הוספת הכל לסל 🛒
              </button>
              
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {recipe.ingredients.map((ing, index) => (
                  ing.trim() && (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #ddd' }}>
                      <span style={{ fontSize: '1.1rem', color: '#222' }}>{ing}</span>
                      <button 
                        style={getPlusButtonStyle(index)}
                        onClick={() => handleAddOne(ing, index)}
                        onMouseEnter={() => setHoveredId(index.toString())}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        {clickedId === index.toString() ? '✓' : '+'}
                      </button>
                    </li>
                  )
                ))}
              </ul>
            </div>

            {/* כרטיס הוראות הכנה */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)', borderRadius: '28px', padding: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#c5a059', marginBottom: '25px', textAlign: 'center', display: 'block', fontWeight: 'bold' }}>אופן ההכנה</span>
              {recipe.steps.map((step, index) => (
                step.trim() && (
                  <div key={index} style={{ backgroundColor: 'rgba(249, 249, 249, 0.8)', padding: '25px', marginBottom: '20px', borderRadius: '18px', borderRight: '6px solid #c5a059', fontSize: '1.15rem', lineHeight: '1.8', color: '#1a1a1a' }}>
                    <div style={{ color: '#c5a059', fontWeight: '800', marginBottom: '8px', fontSize: '0.9rem', letterSpacing: '1px' }}>שלב {index + 1}</div>
                    {step}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;