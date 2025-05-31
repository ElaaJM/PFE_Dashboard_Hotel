import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom'; // ← import this
import './index.css';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter> {/* ← wrap App in this */}
    <App />
  </BrowserRouter>
);
