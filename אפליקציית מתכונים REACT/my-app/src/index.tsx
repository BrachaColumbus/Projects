import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // מייבא את החיבור ל-Redux
import { store } from './app/store';    // מייבא את המחסן שיצרנו

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* כאן קורה הקסם: ה-Provider נותן לכל האפליקציה גישה למחסן */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);