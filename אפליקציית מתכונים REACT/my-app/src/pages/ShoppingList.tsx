import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { toggleItemStatus, removeFromShoppingList, clearShoppingList } from '../features/recipes/recipesSlice';

const ShoppingList: React.FC = () => {
  const shoppingList = useSelector((state: RootState) => state.app.shoppingList);
  const dispatch = useDispatch();
  //סטייט לניהול ריחוף על פריט
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // לוגיקת אימוג'ים מטיילים (שומר על אחידות עם שאר האתר)
  const bgElements = useMemo(() => {
    const icons = ['🛒', '🥖', '🥦', '🍎', '🧀', '🥩', '🥚', '🥛', '🍷', '🍯'];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * -20}s`,
      duration: `${18 + Math.random() * 12}s`,
      size: `${1.2 + Math.random() * 0.8}rem`,
      driftX: `${(Math.random() - 0.5) * 120}px`,
      driftY: `${(Math.random() - 0.5) * 120}px`,
    }));
  }, []);

  // --- Styles ---
  const pageBackground: React.CSSProperties = {
    backgroundColor: '#0a0a0a',
    backgroundImage: `radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%)`,
    minHeight: '100vh',
    padding: '60px 5%',
    direction: 'rtl',
    fontFamily: "'Assistant', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '650px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '30px',
    padding: '50px 40px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    position: 'relative',
    zIndex: 2,
  };

  const listItemStyle = (isBought: boolean, isHovered: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '18px 20px',
    marginBottom: '15px',
    borderRadius: '16px',
    backgroundColor: isHovered ? '#fdf9f0' : '#f9f9f9',
    border: isHovered ? '1px solid #c5a059' : '1px solid #eee',
    transition: 'all 0.3s ease',
    opacity: isBought ? 0.7 : 1,
    transform: isHovered ? 'translateX(-8px)' : 'translateX(0)',
  });

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
          .custom-checkbox {
            width: 22px; height: 22px; cursor: pointer; accent-color: #c5a059;
          }
        `}
      </style>

      {/* אימוג'ים מטיילים ברקע */}
      {bgElements.map(el => (
        <div key={el.id} style={{
          position: 'absolute', top: el.top, left: el.left, fontSize: el.size, opacity: 0.25,
          filter: 'sepia(1) saturate(5) hue-rotate(5deg) drop-shadow(0 0 5px rgba(197, 160, 89, 0.2))',
          //@ts-ignore
          '--dx': el.driftX, '--dy': el.driftY,
          animation: `wander ${el.duration} ease-in-out infinite ${el.delay}`,
          pointerEvents: 'none', zIndex: 1
        } as React.CSSProperties}>{el.icon}</div>
      ))}

      <div style={containerStyle}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          {/* עטיפה לכותרת כדי שהפס יהיה ברוחב המדויק של הטקסט */}
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: '2.8rem', 
              margin: 0, 
              color: '#1a1a1a',
              paddingBottom: '10px' 
            }}>
              רשימת <span style={{ color: '#c5a059' }}>קניות</span>
            </h2>
            {/* הפס החדש - תופס 100% מהרוחב של הכותרת מעליו */}
            <div style={{ 
              width: '100%', 
              height: '3px', 
              background: 'linear-gradient(90deg, transparent, #c5a059, transparent)', 
              margin: '0 auto' 
            }}></div>
          </div>
        </header>

        {shoppingList.length > 0 ? (
          <>
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingLeft: '10px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {shoppingList.map(item => (
                  <li 
                    key={item.id} 
                    style={listItemStyle(item.isBought, hoveredId === item.id)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* תיבת סימון למצב המצרך (נקנה/לא נקנה) */}
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={item.isBought} 
                      onChange={() => dispatch(toggleItemStatus(item.id))} 
                      style={{ marginLeft: '15px' }}
                    />
                    
                    <span style={{ 
                      fontSize: '1.2rem', 
                      flex: 1, 
                      color: item.isBought ? '#999' : '#333',
                      textDecoration: item.isBought ? 'line-through' : 'none',
                      fontWeight: '500',
                      transition: '0.3s'
                    }}>
                      {item.name}
                    </span>
                   {/* כפתור מחיקה שמופיע רק בריחוף על מוצר */}
                    <button 
                      onClick={() => dispatch(removeFromShoppingList(item.id))}
                      style={{ 
                        border: 'none', backgroundColor: 'transparent', color: '#ff4d4d', 
                        cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold',
                        opacity: hoveredId === item.id ? 1 : 0, transition: '0.3s'
                      }}
                    >
                      ✕ מחק
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/* כפתור לניקוי כל הרשימה */}
            <button 
              onClick={() => dispatch(clearShoppingList())}
              style={{ 
                marginTop: '30px', width: '100%', padding: '15px', 
                backgroundColor: '#1a1a1a', color: '#fff', border: 'none', 
                borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', 
                cursor: 'pointer', transition: '0.3s', boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
              נקה את כל הרשימה
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>🛒</div>
            <p style={{ fontSize: '1.2rem', color: '#888', margin: 0 }}>
              הרשימה ריקה. הוסף מצרכים מתוך דפי המתכונים!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;