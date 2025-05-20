import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Contactus from "../Pages/Contactus";
import HomeSaller from "../Pages/HomeSaller";
import HomeBuyer from "../Pages/HomeBuyer";
import Page404 from "../Pages/Page404";
import AccountSettings from "../Pages/AccountSettings";
import Cart from "../Pages/Cart";
import Checkout from "../Pages/Checkout";
import ProductDetails from "../Pages/ProductDetails";
import { CartProvider } from "./CartContext";
import Wishlist from "../Pages/Wishlist";
import About from "../Pages/About";
import Profile from "../Pages/Profile";
import { Registration } from "../Pages/Registration";
import LoginPage from "../Pages/login";
import AdminDashboard from "../Pages/AdminDashboard";
import { AuthProvider } from "./AuthContext";
const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    ),
    children: [
      { path: "/contacus", element: <Contactus /> },
      { path: "/", element: <HomeBuyer /> },
      { path: "homebuyer", element: <HomeBuyer /> },
      { path: "homesaller", element: <HomeSaller /> },
      { path: "contacus", element: <Contactus /> },
      { path: "accountsettings", element: <AccountSettings /> },
      { path: "signup", element: <Registration /> },
      { path: "login", element: <LoginPage /> },
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "*", element: <Page404 /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/about", element: <About /> },
      { path: "/profile", element: <Profile /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "productdetails", element: <ProductDetails /> },
    ],
  },
]);
export default routes;
