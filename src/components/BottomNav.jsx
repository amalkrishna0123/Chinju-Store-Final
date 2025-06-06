import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, X, Minus, Plus, Trash } from "lucide-react";
import { GrLogin } from "react-icons/gr";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import apple from "../assets/apple.jpeg";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch cart items when user changes
  useEffect(() => {
    if (currentUser?.cartItems) {
      setCartItems(currentUser.cartItems);
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  const handleCartClick = () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      setShowCart(true);
    }
  };

  // Update quantity function
  const updateQuantity = async (productId, newQuantity) => {
    if (!currentUser) return;

    try {
      const updatedItems = cartItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      if (currentUser?.uid) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          cartItems: updatedItems,
        });
      }

      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const updatedItems = cartItems.filter((item) => item.id !== id);

      if (currentUser?.uid) {
        await updateDoc(doc(db, "users", currentUser.uid), {
          cartItems: updatedItems,
        });
      }

      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.salePrice * item.quantity,
      0
    );
  };

  const CartModal = () => {
    if (!showCart) return null;

    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center md:justify-end">
        <div className="w-full md:w-1/4 h-full md:h-screen bg-white md:shadow-lg transform transition-transform duration-300 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Cart {cartItems.length > 0 ? `(${cartItems.length})` : ""}
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2"
            >
              <X size={18} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <ShoppingCart size={24} />
              </div>
              <p className="text-center text-gray-600 mb-6">
                Your cart is empty
              </p>
              <button
                onClick={() => setShowCart(false)}
                className="w-full bg-[#1a7e74] text-white py-3 rounded-lg hover:bg-[#145f5a] transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100"
                  >
                    <img
                      src={item.imageBase64 || apple}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.weight}</p>
                      <div className="flex items-center mt-2">
                        <span className="font-semibold text-gray-900">
                          ₹{item.salePrice || item.originalPrice}
                        </span>
                        {item.originalPrice && (
                          <span className="text-gray-400 text-xs line-through ml-2">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 mb-2"
                      >
                        <Trash size={16} />
                      </button>
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-2 text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 text-gray-500 hover:text-blue-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold">₹40</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-green-600">-₹0</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    ₹{calculateTotal() + 40}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowCart(false);
                    navigate("/order-confirm");
                  }}
                  className="w-full bg-[#1a7e74] text-white py-3 rounded-lg hover:bg-[#145f5a] transition duration-200"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#1d9e8b] to-[#057161] shadow-md flex justify-around z-50 pt-[2.5px]">
        <div className="flex justify-around w-full bg-[#fff] py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <Home
              className={`w-6 h-6 ${
                location.pathname === "/" ? "text-[#1d9e8b]" : ""
              }`}
            />
            <span>Home</span>
          </Link>
          <button
            onClick={handleCartClick}
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <div className="relative">
              <ShoppingCart
                className={`w-6 h-6 ${
                  location.pathname === "/cart" ? "text-[#1d9e8b]" : ""
                }`}
              />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>
          <Link
            to="/login"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <GrLogin
              className={`w-6 h-6 ${
                location.pathname === "/login" ? "text-[#1d9e8b]" : ""
              }`}
            />
            <span>Login</span>
          </Link>
        </div>
      </div>
      <CartModal />
    </>
  );
};

export default BottomNav;