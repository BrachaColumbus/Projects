import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe, updateRecipe } from '../features/recipes/recipesSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../app/store';

const AddEditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //בודק אם אנחנו במצב עריכה או הוספה
  const isEditMode = Boolean(id);
  //דרכו ניגש למחסן
  const dispatch = useDispatch();
  //אחראי למעבר בין הדפים
  const navigate = useNavigate();
  // אם במצב עריכה, מוצא את המתכון הקיים
  const existingRecipe = useSelector((state: RootState) =>
    isEditMode ? state.app.recipes.find((r) => r.id === id) : null
  );
// רפרנסים לשדות הטופס
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
// סטייטים לשדות הטופס
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false); // סטייט לזיהוי גרירה
//רשימת האימוג'ים המטיילים ברקע
  const bgElements = useMemo(() => {
    const icons = ['👩‍🍳', '🍰', '🍕', '🥣', '🥐', '🍫', '🍳', '🧁', '🍩', '🥨', '🍪', '🧂'];
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 95}%`,
      delay: `${Math.random() * -20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 0.8}rem`,
      driftX: `${(Math.random() - 0.5) * 100}px`,
      driftY: `${(Math.random() - 0.5) * 100}px`,
    }));
  }, []);

  //ממלא את השדות אם במצב עריכה
  useEffect(() => {
    if (isEditMode && existingRecipe) {
      setTitle(existingRecipe.title);
      setIngredients(existingRecipe.ingredients.join(', '));
      setSteps(existingRecipe.steps.join('. '));
      setImageUrl(existingRecipe.imageUrl || '');
    }

    //שם פוקוס על שדה הכותרת כשנטען הדף 
    titleInputRef.current?.focus();
  },
  //    
   [isEditMode, existingRecipe]);
//טיפול בקובץ תמונה
  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

// אירועים לגרירה ושחרור קובץ
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
// טיפול בהגשת הטופס
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !ingredients || !steps) {
      alert("נא למלא את כל השדות!");
      return;
    }
    
    const recipeData = {
      id: isEditMode ? id! : Date.now().toString(),
      title,
      ingredients: ingredients.split(',').map(i => i.trim()),
      steps: steps.split('.').map(s => s.trim()).filter(s => s !== ""),
      imageUrl
    };

    // אם אנחנו במצב עריכה, עדכן את המתכון; אם לא, הוסף מתכון חדש
    if (isEditMode) dispatch(updateRecipe(recipeData));
    else dispatch(addRecipe(recipeData));
    navigate('/');
  };

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

  const formContainerStyle: React.CSSProperties = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '50px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    borderRadius: '24px',
    position: 'relative',
    zIndex: 2,
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
        `}
      </style>
{/* פיזור האימוג'ים המטיילים */}
      {bgElements.map(el => (
        <div key={el.id} style={{
          position: 'absolute', top: el.top, left: el.left, fontSize: el.size, opacity: 0.3,
          filter: 'sepia(1) saturate(6) hue-rotate(5deg) drop-shadow(0 0 5px rgba(197, 160, 89, 0.2))',
          //@ts-ignore
          '--dx': el.driftX, '--dy': el.driftY,
          animation: `wander ${el.duration} ease-in-out infinite ${el.delay}`,
          pointerEvents: 'none', zIndex: 1
        } as React.CSSProperties}>{el.icon}</div>
      ))}

      <div style={formContainerStyle}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', margin: 0, color: '#1a1a1a', paddingBottom: '10px' }}>
              {isEditMode ? 'עריכת מתכון' : 'הוספת מתכון חדש'}
            </h2>
            <div style={{ width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, #c5a059, transparent)', margin: '0 auto' }}></div>
          </div>
        </header>

        <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>שם המנה</label>
          {/*שדה האינפוט לכותרת */}
          <input ref={titleInputRef} type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
            style={{ padding: '15px', marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', width: '100%', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' }} 
            placeholder="למשל: קרם ברולה קלאסי" />
          {/*אזור לגרירת קובץ תמונה */}
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>תמונת המתכון</label>
          <div 
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging ? '2px solid #c5a059' : '2px dashed #eee',
              padding: '30px', borderRadius: '15px', textAlign: 'center',
              cursor: 'pointer', marginBottom: '20px', 
              backgroundColor: isDragging ? '#fffdf5' : '#fcfcfc', 
              transition: '0.3s',
              transform: isDragging ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            {imageUrl ? <img src={imageUrl} alt="Preview" style={{ maxHeight: '150px', borderRadius: '10px' }} /> : 
            <p style={{ color: '#888', margin: 0 }}>📸 גררי לכאן תמונה או לחצי להעלאה</p>}
            <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} accept="image/*" />
          </div>
          {/*שדה לאינפוט של מרכיבים */}
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>מצרכים (הפרידי בפסיקים)</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} 
            style={{ padding: '15px', marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', width: '100%', boxSizing: 'border-box', fontSize: '1rem', outline: 'none', minHeight: '80px' }} />
          {/*שדה לאינפוט של הוראות הכנה */}
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>הוראות הכנה (הפרידי בנקודות)</label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} 
            style={{ padding: '15px', marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', width: '100%', boxSizing: 'border-box', fontSize: '1rem', outline: 'none', minHeight: '120px' }} />
          {/*  כפתור שמירת המתכון */}
          <button type="submit" style={{
            width: '100%', padding: '15px', backgroundColor: '#1a1a1a', color: '#fff',
            border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
          }}
          // אפקט שינוי צבע רקע בלחיצה
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c5a059'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
          >
            {/* שינוי הטקסט על הכפתור בהתאם למצב */}
            {isEditMode ? 'עדכן מתכון' : 'שמור מתכון באוסף'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditRecipe;