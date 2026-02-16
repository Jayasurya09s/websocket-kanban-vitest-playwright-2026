import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, MouseTransition, TouchTransition } from "react-dnd-multi-backend";

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: MouseTransition
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition
    }
  ]
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <App />
        </DndProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
