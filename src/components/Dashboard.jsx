import { useNavigate, Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
const Dashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleSubmenu = (index) => {
    if (activeSubmenu === index) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(index);
    }
  };

  const menuItems = [
    {
      label: "Category", path: "/dashboard/view-category" 
      
    },
    {
      label: "Product", path: "/dashboard/view-product"
      
    },
    {
      label: "Banner", path: "/dashboard/view-banner" 
      
    },
    { label: "Order", path: "/dashboard/orders" },
    { label: "User", path: "/dashboard/users" },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top navbar */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <BsThreeDotsVertical
              className="text-xl cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                {menuItems.map((item, index) => (
                  <div key={index} className="relative">
                    {item.subItems ? (
                      <>
                        <div
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                          onClick={() => toggleSubmenu(index)}
                        >
                          {item.label}
                          
                        </div>
                        {activeSubmenu === index && (
                          <div className="bg-gray-50 py-1 pl-6">
                            {item.subItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to the Dashboard!
        </h1>
        <Link to="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            HOME
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;