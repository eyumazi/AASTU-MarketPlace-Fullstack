import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from './Components/routes.jsx'
import { RouterProvider } from "react-router-dom";
import { CartProvider } from './Components/CartContext';

createRoot(document.getElementById("root")).render(

  <StrictMode>
   
      
    <RouterProvider router={routes} />
    
  </StrictMode>

);
