import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    padding: '0', // נוריד פדינג מכאן כדי שהפס יהיה צמוד למטה
    height: '70px',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    direction: 'rtl'
  };

  const navListStyle: React.CSSProperties = {
    listStyle: 'none',
    display: 'flex',
    gap: '30px',
    margin: 0,
    padding: 0,
    height: '100%',
    alignItems: 'center'
  };

  // פונקציית העיצוב המאוחדת
  const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    fontSize: '1.1rem',
    color: isActive ? '#c5a059' : '#ffffff',
    // שימוש בצל במקום BOLD כדי למנוע רעידה
    textShadow: isActive ? '0.5px 0 0 #c5a059, -0.5px 0 0 #c5a059' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 20px',
    height: '100%', // תופס את כל גובה הסרגל
    position: 'relative',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? 'rgba(197, 160, 89, 0.05)' : 'transparent',
  });

  return (
    <nav style={navStyle}>
      <ul style={navListStyle}>
        <li>
          <NavLink to="/" style={({ isActive }) => getLinkStyle(isActive)}>
            {({ isActive }) => (
              <>
                <span>🍳</span>
                <span>מתכונים</span>
                {/* הפס המוזהב מופיע רק אם הקישור פעיל באמת */}
                {isActive && <div style={activeLineStyle} />}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" style={({ isActive }) => getLinkStyle(isActive)}>
            {({ isActive }) => (
              <>
                <span>➕</span>
                <span>הוספת מתכון</span>
                {isActive && <div style={activeLineStyle} />}
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/shopping-list" style={({ isActive }) => getLinkStyle(isActive)}>
            {({ isActive }) => (
              <>
                <span>🛒</span>
                <span>רשימת קניות</span>
                {isActive && <div style={activeLineStyle} />}
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

// עיצוב הפס התחתון
const activeLineStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '3px',
  backgroundColor: '#c5a059',
  boxShadow: '0 -2px 10px rgba(197, 160, 89, 0.5)',
  borderRadius: '3px 3px 0 0'
};

export default Navbar;