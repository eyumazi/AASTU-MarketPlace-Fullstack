import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from './Components/routes.jsx'
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './Components/AuthContext.jsx';

createRoot(document.getElementById("root")).render(

  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  </StrictMode>

);
