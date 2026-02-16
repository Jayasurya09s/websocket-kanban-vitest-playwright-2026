import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
