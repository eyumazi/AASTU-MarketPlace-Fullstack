import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import Contactus from "../Pages/Contactus";
import Home from "../Pages/Home";


import Page404 from "../Pages/Page404";
import AccountSettings from "../Pages/AccountSettings";

import Cart from "../Pages/Cart";
import Checkout from "../Pages/Checkout"; 
import ProductDetails from "../Pages/ProductDetails";
import { CartProvider } from "./CartContext";



import Wishlist from "../Pages/Wishlist";
import About from "../Pages/About";
import Profile from "../Pages/Profile";










const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <CartProvider>
      <Layout />
      </CartProvider>
    ),
    children: [
      { path: "/contacus", element: <Contactus /> },
      { path: "/", element: <Home /> },

      { path: "contacus", element: <Contactus /> },
      { path: "accountsettings", element: <AccountSettings /> },
      { path: "signup", element: <test /> },
      // { path: "login", element: <Login /> },

      { path: "*", element: <Page404 /> },

      
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/about", element: <About /> },
      { path: "/profile", element: <Profile /> },

      

      {path:"cart", element: <Cart />},
      {path:"checkout", element: <Checkout />},
      {path:"productdetails", element: <ProductDetails />},

    ],
  },
]);
export default routes;

