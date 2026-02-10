import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

const RecipesList: React.FC = () => {
  const recipes = useSelector((state: RootState) => state.app.recipes);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
//הUSEMEMO עושה שהאימוגים לא ייצרו מחדש בכל רינדור
  const bgElements = useMemo(() => {
    const icons = ['👩‍🍳', '🍰', '🍕', '🥣', '🥐', '🍫', '🍳', '🧁', '🍩', '🥨', '🍪', '🧂'];
    // יוצר מערך של 25 אימוג'ים עם מיקומים ואנימציות אקראיות
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * -20}s`, // התחלה בזמנים שונים
      duration: `${15 + Math.random() * 15}s`, // תנועה איטית ורגועה יותר
      size: `${1 + Math.random() * 0.8}rem`,
      driftX: `${(Math.random() - 0.5) * 100}px`, // מרחק טיול אופקי
      driftY: `${(Math.random() - 0.5) * 100}px`, // מרחק טיול אנכי
    }));
  }, []);

  const pageBackground: React.CSSProperties = {
    backgroundColor: '#0a0a0a',
    backgroundImage: `radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)`,
    minHeight: '100vh',
    padding: '60px 5%',
    direction: 'rtl',
    fontFamily: "'Assistant', sans-serif",
    position: 'relative',
    overflow: 'hidden' // חשוב כדי שהאימוג'ים המטיילים לא ייצרו פסי גלילה
  };

  return (
    <div style={pageBackground}>
      {/* אנימציית טיול רגועה */}
      <style>
        {`
          @keyframes wander {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(var(--dx), var(--dy)) rotate(10deg); }
            66% { transform: translate(calc(var(--dx) * -1), calc(var(--dy) * 0.5)) rotate(-10deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          body { overflow-x: hidden; }
        `}
      </style>

      {/* פיזור האימוג'ים המטיילים */}
      {bgElements.map(el => (
        <div 
          key={el.id} 
          style={{
            position: 'absolute',
            top: el.top,
            left: el.left,
            fontSize: el.size,
            opacity: 0.3,
            filter: 'sepia(1) saturate(6) hue-rotate(5deg) drop-shadow(0 0 5px rgba(197, 160, 89, 0.2))',
            // שימוש במשתני CSS כדי שכל אימוג'י יטייל למקום אחר
            //@ts-ignore
            '--dx': el.driftX,
            '--dy': el.driftY,
            animation: `wander ${el.duration} ease-in-out infinite ${el.delay}`,
            pointerEvents: 'none',
            zIndex: 1
          } as React.CSSProperties}
        >
          {el.icon}
        </div>
      ))}

      <div style={{ textAlign: 'center', marginBottom: '70px', position: 'relative', zIndex: 2 }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '3.8rem', 
          color: '#fff', 
          margin: 0,
          textShadow: '0 4px 15px rgba(0,0,0,0.8)' 
        }}>
          אוצר <span style={{ color: '#c5a059' }}>המתכונים</span>
        </h1>
        <div style={{ width: '100px', height: '2px', background: 'linear-gradient(90deg, transparent, #c5a059, transparent)', margin: '20px auto' }}></div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '40px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 2 
      }}>
        {/* כרטיס מתכון בודד */}
        {recipes.map(recipe => (
          <div 
            key={recipe.id} 
            style={{
              backgroundColor: '#fff',
              borderRadius: '24px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.5s cubic-bezier(0.2, 1, 0.3, 1)',
              transform: hoveredId === recipe.id ? 'translateY(-15px) scale(1.03)' : 'translateY(0)',
              boxShadow: hoveredId === recipe.id 
                ? '0 30px 60px rgba(197, 160, 89, 0.25)' 
                : '0 10px 30px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              border: hoveredId === recipe.id ? '1px solid #c5a059' : '1px solid transparent',
            }}
            // אירועי עכבר לכרטיס
            onMouseEnter={() => setHoveredId(recipe.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <div style={{ overflow: 'hidden', height: '280px' }}>
              <img 
                src={recipe.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                alt={recipe.title}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.8s ease',
                  transform: hoveredId === recipe.id ? 'scale(1.15)' : 'scale(1)'
                }}
              />
            </div>
            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1a1a1a', fontWeight: '800' }}>
                {recipe.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {/* כפתור הפלוס הצף להוספת מתכון חדש */}
      <button 
        onClick={() => navigate('/add')}
        style={{
          position: 'fixed', bottom: '50px', left: '50px', width: '75px', height: '75px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #c5a059 0%, #9e7d3e 100%)',
          color: '#fff', fontSize: '35px', border: 'none', cursor: 'pointer',
          boxShadow: '0 15px 35px rgba(197, 160, 89, 0.4)', zIndex: 1000, transition: 'all 0.3s'
        }}
        // אנימציית סיבוב והגדלה על ריחוף
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      >
        +
      </button>
    </div>
  );
};

export default RecipesList;