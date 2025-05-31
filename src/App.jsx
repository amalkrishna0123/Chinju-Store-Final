import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Cart from "./components/Cart";
import UserProfile from "./components/UserProfile";
import LoginModal from "./components/LoginModel";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Orders from "./components/Orders";
import Wishlist from "./components/Wishlist";
import AddCategory from "./components/AddCategory";
import ViewCategory from "./components/ViewCategory";
import EditCategory from "./components/EditCategory";
import AddBanner from "./components/AddBanner";
import ViewBanner from "./components/ViewBanner";
import EditBanner from "./components/EditBanner";
import AddProduct from "./components/AddProduct";
import ViewProduct from "./components/ViewProduct";
import EditProduct from "./components/EditProduct";
import ProductAllView from "./components/ProductViewAll";
import ProductCategoryView from './components/ProductCategoryView'
import ProductDetail from "./components/Product";
import ProductCheckout from "./components/ProductCheckout";
import OrderConfirm from './components/OrderConfirm';
import OrderDetails from './components/OrderDetails';
import Users from './components/Usersdash';
import Delivery from './components/DeliveryBoys'
import AddDeliveryBoy from './components/AddDeliveryBoy';
import EditDeliveryBoy from './components/EditDeliveryBoy';
import DeliveryDashboard from './components/DeliveryBoyDash'
import Payment from './components/Payment';
import LottieAnimation from "./components/cart animations/LottieAnimation";
// Protected Route Component

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || (location.pathname === "/dashboard" && !isAdmin)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppRoutes() {
  const location = useLocation();
  const hideBottomNav =
    location.pathname === "/dashboard" ||
    location.pathname === "/login" ||
    location.pathname === "/dashboard/add-category" ||
    location.pathname === "/dashboard/view-category" ||
    location.pathname === "/dashboard/add-banner" ||
    location.pathname === "/dashboard/view-banner" ||
    location.pathname === "/dashboard/edit-category/:id" ||
    location.pathname === "/dashboard/edit-banner/:id" ||
    location.pathname === "/dashboard/view-product" ||
    location.pathname === "/dashboard/add-product" ||
    location.pathname === "/dashboard/edit-product" ||
    location.pathname === "/productviewall" ||
    location.pathname === "/category/:categoryName" ||
    location.pathname === "/product/:productId"
  return (
    <>
      <div className="min-h-screen pb-16 bg-[#f5f6fa]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/login-modal"
            element={
              <LoginModal showLoginModal={true} setShowLoginModal={() => {}} />
            }
          />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-category" element={<AddCategory />} />
          <Route path="/dashboard/view-category" element={<ViewCategory />} />
          <Route
            path="/dashboard/edit-category/:id"
            element={<EditCategory />}
          />
          <Route path="/dashboard/add-banner" element={<AddBanner />} />
          <Route path="/dashboard/view-banner" element={<ViewBanner />} />
          <Route path="/dashboard/edit-banner/:id" element={<EditBanner />} />
          <Route path="/dashboard/add-product" element={<AddProduct />} />
          <Route path="/dashboard/view-product" element={<ViewProduct />} />
          <Route path="/dashboard/edit-product/:id" element={<EditProduct />} />
          <Route path="/productviewall" element={<ProductAllView />} />
          <Route path="/category/:categoryName" element={<ProductCategoryView />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/product/ProductCheckout" element={<ProductCheckout />} />
          <Route path="/order-confirm" element={<OrderConfirm />} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/dashboard/orderdetails" element={<OrderDetails />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/delivery-boys" element={<Delivery />} />
          <Route path="/dashboard/add-delivery-boy" element={<AddDeliveryBoy />} />
          <Route path="/dashboard/edit-delivery-boy/:id" element={<EditDeliveryBoy />} />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart isOpen={true} onClose={() => {}} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AuthProvider>
        {showAnimation ? (
          <LottieAnimation />
        ) : (
          <AppRoutes />
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
