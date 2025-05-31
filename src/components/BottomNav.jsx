import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingCart } from "lucide-react";
import { GrLogin } from "react-icons/gr";
const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#1d9e8b] to-[#057161] shadow-md flex justify-around z-50 pt-[2.5px]">
      <div className="flex justify-around w-full bg-[#fff] py-2">
        <Link to="/" className="flex flex-col items-center text-sm text-gray-700">
        <Home className={`w-6 h-6 ${location.pathname === "/" ? "text-[#1d9e8b]" : ""}`} />
        <span>Home</span>
      </Link>
      <Link to="/cart" className="flex flex-col items-center text-sm text-gray-700">
        <ShoppingCart className={`w-6 h-6 ${location.pathname === "/cart" ? "text-[#1d9e8b]" : ""}`} />
        <span>Cart</span>
      </Link>
      <Link to="/login" className="flex flex-col items-center text-sm text-gray-700">
        <GrLogin className={`w-6 h-6 ${location.pathname === "/login" ? "text-[#1d9e8b]" : ""}`} />
        <span>Login</span>
      </Link>
      </div>
    </div>
  );
};

export default BottomNav;
