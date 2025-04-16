import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart } from "lucide-react";
import { GrLogin } from "react-icons/gr";
const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t flex justify-around py-2 z-50">
      <Link to="/" className="flex flex-col items-center text-sm text-gray-700">
        <Home className={`w-6 h-6 ${location.pathname === "/" ? "text-purple-600" : ""}`} />
        <span>Home</span>
      </Link>
      <Link to="/cart" className="flex flex-col items-center text-sm text-gray-700">
        <ShoppingCart className={`w-6 h-6 ${location.pathname === "/cart" ? "text-purple-600" : ""}`} />
        <span>Cart</span>
      </Link>
      <Link to="/login" className="flex flex-col items-center text-sm text-gray-700">
        <GrLogin className={`w-6 h-6 ${location.pathname === "/login" ? "text-purple-600" : ""}`} />
        <span>Login</span>
      </Link>
    </div>
  );
};

export default BottomNav;
