import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  Heart,
  X,
  Minus,
  Plus,
  Trash,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import apple from "../assets/apple.jpeg";
import { useAuth } from "./AuthContext";
import { MdLogin } from "react-icons/md";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { query, orderBy, limit } from "firebase/firestore";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { VscAccount } from "react-icons/vsc";
import allproduct from "../assets/allproduct.jpeg";
import { useNavigate } from "react-router-dom";
import ProductsLoader from "./ProductsLoader";

import { motion, AnimatePresence } from "framer-motion";
import ff from "../assets/ff.png";
import fff from "../assets/fff.jpg";
import dot from "../assets/dot.png";
import HomeLoader from "./cart animations/HomeLoader";
import { IoIosCloseCircle } from "react-icons/io";
import Footer from "./Footer";
import logo from "../assets/logo.png"
import logowhite from "../assets/logowhite.png"
import noLocation from "../assets/nolocation.jpg"

// Utility: Haversine Distance Calculation
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};




const Home = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [productsLoader, setProductsLoader] = useState(true);
  const [index, setIndex] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [userLocation, setUserLocation] = useState({
    address: "Select Your Location",
    deliveryTime: "Super fast",
    coordinates: null, // Add coordinates to track if location is set
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const words = ["products", "categories", "services", "items"];
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [isDeliverable, setIsDeliverable] = useState(true);
  const [locationChecked, setLocationChecked] = useState(false);
  // const desiredCategoryOrder = [
  //   "Grocery & Kitchen",
  //   "Snacks & Drinks",
  //   "Beauty & Personal care",
  //   "Household Essentials"
  // ];

  // Modern cool color scheme
  const colors = {
    primary: "#1A7E74", // Teal Primary
    secondary: "#16675F", // Darker Teal
    accent: "#3B82F6", // Blue Accent
    light: "#F8FAFC", // Cool Gray Light
    dark: "#1E293B", // Slate Dark
    white: "#FFFFFF",
    success: "#10B981", // Emerald Green
    danger: "#EF4444", // Red
    gray: "#94A3B8", // Slate Gray
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Slower animation for elegance

    return () => clearInterval(interval);
  }, []);

  const navigateToProduct = (productId, event) => {
    // Prevent event from triggering when clicking on buttons inside the card
    if (event.target.closest("button")) return;
    navigate(`/product/${productId}`);
  };

  // scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define filtered products with search functionality
  const getFilteredProducts = () => {
    let result =
      selectedCategory === "All" || selectedCategory === "All Products"
        ? products
        : products.filter(
            (product) =>
              product.category === selectedCategory || // main
              product.subcategory === selectedCategory // sub
          );

    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.category &&
            product.category.toLowerCase().includes(query)) ||
          (product.subcategory &&
            product.subcategory.toLowerCase().includes(query)) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    return result;
  };

  // filtered category product
  const getFilteredProductsAndCategories = () => {
    // First filter products as before
    let filteredProducts =
      selectedCategory === "All" || selectedCategory === "All Products"
        ? products
        : products.filter(
            (product) =>
              product.category === selectedCategory ||
              product.subcategory === selectedCategory
          );

    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.category &&
            product.category.toLowerCase().includes(query)) ||
          (product.subcategory &&
            product.subcategory.toLowerCase().includes(query)) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );

      // Also filter categories based on search query
      const filteredGroupedCategories = groupedCategories
        .map((mainCategory) => ({
          ...mainCategory,
          subcategories: mainCategory.subcategories.filter((sub) =>
            sub.name.toLowerCase().includes(query)
          ),
        }))
        .filter((mainCategory) => mainCategory.subcategories.length > 0);

      return { filteredProducts, filteredGroupedCategories };
    }

    return { filteredProducts, filteredGroupedCategories: groupedCategories };
  };

  // Use the filtered data
  const { filteredProducts, filteredGroupedCategories } =
    getFilteredProductsAndCategories();

  // Use the filtered products
  // const filteredProducts = getFilteredProducts();

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setProductsLoader(false);
        setHomeLoading(false);
      } catch (err) {
        // console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);


  // Define the exact desired order (make sure these names exactly match your Firestore data)
 useEffect(() => {
  // Use main category IDs for ordering instead of names
  const CATEGORY_DISPLAY_ORDER = [
    "egWACgVKvqO1o6S3QJqS", // Grocery & Kitchen
    "LqtTquG9TfhkovdvJFdD", // Snacks & Drinks
    "HwEpO9DIkQ2ZFtGxVxWF", // Beauty & Personal care
    "96tY0zTWrAyjLuztp8Pe", // Household Essentials
  ];
  
  // Map main category IDs to their subcategory ID orders
  const SUBCATEGORY_ID_ORDERS = {
    egWACgVKvqO1o6S3QJqS: [
      // Grocery & Kitchen
      "pDIlYhnM25VyAWGanFck", // Fruits & Vegetables
      "o3XBW2tkRKGp7XaqfdJy", // Dairy, Bread & Eggs
      "bsUVGwFHr9mKsd3tDtEA", // Atta, Rice, Oil & Dals
      "obuYruSyIDZ3u8DPZdh2", // Masala & Dry Fruits
      "4F4RBqDTcNLckK86eJ6s", // Breakfast & Sauces
      "6tj4n7TYc0XbQKwy3DpO", // Package Foods
    ],
    LqtTquG9TfhkovdvJFdD: [
      // Snacks & Drinks
      "o9ceHTun7JizNwAUTeEJ", // Tea, Coffee & More
      "EveHMgA7W0evPRujrerW", // Ice Cream & More
      "X09NiEXeEhN9lDh99Hy6", // Frozen Food
      "xigeItGtCwEGoDkM2Lht", // Sweet Cravings
      "7Xyr2X9vpSITeDAKOsZq", // Cold Drinks & Juices
      "qpIobAA2q93w0vQY7WRH", // Munchies
      "tjM9u8y5YZmFARMb7iiI", // Biscuits & Cookies
    ],
    HwEpO9DIkQ2ZFtGxVxWF: [
      "3FaJ10wV0AEHzg3lhHJV", // Makeup
      "KdaOTRsfHTsJLwQRjx3S", // Skin Care
      "olgTss7Hk3ZDfX0fOLQB", // Bath & Body
      "09fIfVCJAJIz10fKrYWD", // Hair Care
      "4PAkqyM0oHQWluSIuOSB", // Fragrances
      "Di8jCGdyVFTinaTAtpls", // Men’s Grooming

      "yCv3oaYE3qJqjaszQKoB", // Feminine Hygiene
      "ywuxnLZcUFgRmLllVe8h", // Oral Care
    ], // Beauty & Personal care
    "96tY0zTWrAyjLuztp8Pe": [
       
       "IEZajimU0SRjcJ2DC0qh", // Home Safety & Hygiene
       "MGjtqz8S76o6tVYItM39", // Laundry Care
       "MLaEYnkCRjBAxhGFDbMU", // Dishwashing Essentials
       "NrWbuediTrSenmg4yWDL", // Paper Products
       "vXoSiAVazyyulVelieK4", // Disinfectants & Sanitizer
       "Rkp5ThzbThlxJviI2k2h", // Tissues & Napkins
       "dTtby9rrqKxMNWrF2L7q", // Bathroom Essentials
       "e9YVg7gy8EJDz4jEq6gS", // Air Fresheners & Deodorizers
       "k2YRjwMMpuSIvzzn2tiP", // Storage & Organizers
       "kgumepwd7COKCfdEtxta", // Batteries & Electricals
       "lBJ15JWhwLtqrIQJNHxp", // Lighting & Bulbs
       "uXT0brFO7EzS3lds8pZh", // Trash Bags & Bins
       
       "5F0eToUsslWjemNS2t35", // Pest Control
    ], // Household Essentials
  };

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Separate main and sub categories
      const mainCategories = fetched.filter((cat) => cat.type === "main");
      const subCategories = fetched.filter((cat) => cat.type === "sub");

      // Sort main categories according to our specific ID order
      const sortedMainCategories = CATEGORY_DISPLAY_ORDER
        .map(id => mainCategories.find(cat => cat.id === id))
        .filter(Boolean);

      // Group subcategories under the sorted main categories with their own ordering
      const grouped = sortedMainCategories.map((mainCat) => {
        if (!mainCat) return null;
        
        const subcats = subCategories.filter((subCat) => subCat.parentId === mainCat.id);
        
        // Sort subcategories if we have a defined ID order for this main category
        let sortedSubcats = [];
        if (SUBCATEGORY_ID_ORDERS[mainCat.id] && SUBCATEGORY_ID_ORDERS[mainCat.id].length > 0) {
          // Create subcategories in exact order specified by ID
          SUBCATEGORY_ID_ORDERS[mainCat.id].forEach((orderedId) => {
            const found = subcats.find(sub => sub.id === orderedId);
            if (found) {
              sortedSubcats.push(found);
            }
          });
          
          // Add any remaining subcategories not in the ordered list
          const remainingSubcats = subcats
            .filter(sub => !SUBCATEGORY_ID_ORDERS[mainCat.id].includes(sub.id))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          sortedSubcats = [...sortedSubcats, ...remainingSubcats];
        } else {
          // Default alphabetical sorting for categories without specific order
          sortedSubcats = [...subcats].sort((a, b) => a.name.localeCompare(b.name));
        }

        return {
          id: mainCat.id,
          name: mainCat.name,
          subcategories: sortedSubcats
        };
      }).filter(Boolean);

      setGroupedCategories(grouped);
      setHomeLoading(false);

      setCategories([
        { id: "all", name: "All Products", imageBase64: allproduct },
        ...fetched,
      ]);

    } catch (err) {
      // console.error("Error fetching categories:", err);
    }
  };

  fetchCategories();
}, []);

  // Fetch banners from Firestore
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "banners"));
        const bannerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBanners(bannerList);
        setHomeLoading(false);
      } catch (err) {
        // console.error("Error fetching banners:", err);
      }
    };

    fetchBanners();
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowLoginModal(false);
    } catch (error) {
      // console.error("Google Sign-In Error:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    setCartItems([]);
  };

  // Cart functions
  useEffect(() => {
    if (currentUser?.cartItems) {
      setCartItems(currentUser.cartItems);
    } else {
      setCartItems([]);
    }
    if (currentUser?.wishlist) {
      setWishlist(currentUser.wishlist);
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

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
      // console.error("Error updating quantity:", error);
    }
  };

  // Add to cart function
  const addToCart = async (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      const updatedItems = [...cartItems];
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({
          ...product,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
      }

      await updateDoc(doc(db, "users", currentUser.uid), {
        cartItems: updatedItems,
      });

      setCartItems(updatedItems);
    } catch (error) {
      // console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const cartItems = userDoc.data().cartItems || [];
        const updatedItems = cartItems.filter((item) => item.id !== productId);

        await updateDoc(doc(db, "users", currentUser.uid), {
          cartItems: updatedItems,
        });

        // Update local state
        setCartItems(updatedItems);
      }
    } catch (error) {
      // console.error("Error removing from cart:", error);
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
      // console.error("Error removing item:", error);
    }
  };

  const toggleWishlist = async (product) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const wishlist = userDoc.data().wishlist || [];
        const isInWishlist = wishlist.some((item) => item.id === product.id);

        if (isInWishlist) {
          await updateDoc(doc(db, "users", currentUser.uid), {
            wishlist: arrayRemove(product),
          });

          // Update local state
          setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        } else {
          await updateDoc(doc(db, "users", currentUser.uid), {
            wishlist: arrayUnion(product),
          });

          // Update local state
          setWishlist((prev) => [...prev, product]);
        }
      }
    } catch (error) {
      // console.error("Error toggling wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Improved location function
  const fetchCurrentLocation = async () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiKey = "0f026c32f1ac42d58b4afc31e690a961"; // OpenCage API key
        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          const components = data.results[0]?.components || {};
          const parts = [
            components.suburb, // e.g., Chittattukara
            components.village, // e.g., Pavaratty
            components.county, // e.g., Thrissur
          ];

          const formattedAddress = parts.filter(Boolean).join(", ");

          setUserLocation({
            address:
              formattedAddress ||
              `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            deliveryTime: "9 mins",
          });

          if (currentUser?.uid) {
            await updateDoc(doc(db, "users", currentUser.uid), {
              location: {
                address: formattedAddress,
                coordinates: {
                  lat: latitude,
                  lng: longitude,
                },
              },
            });
          }
        } catch (error) {
          // console.error("Error fetching address from OpenCage API:", error);
          setUserLocation({
            address: `(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            deliveryTime: "9 mins",
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        // console.error("Error getting location:", error);
        alert("Location permission denied. Please allow location access.");
        setIsLoadingLocation(false);
      }
    );
  };

  // Call this in useEffect when user logs in
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (currentUser?.uid) {
        setIsLoadingLocation(true);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().location) {
            setUserLocation(userDoc.data().location);
          }
        } catch (error) {
          // console.error("Error fetching user location:", error);
        } finally {
          setIsLoadingLocation(false);
        }
      }
    };

    fetchUserLocation();
  }, [currentUser]);

  // Update the deliverability check useEffect
  useEffect(() => {
    const checkDeliverability = () => {
      const storeLat = 10.52700579443476;
      const storeLng = 76.08863395142001;

      // Only check if coordinates are explicitly set
      if (userLocation?.coordinates?.lat && userLocation?.coordinates?.lng) {
        const distance = getDistanceFromLatLonInKm(
          storeLat,
          storeLng,
          userLocation.coordinates.lat,
          userLocation.coordinates.lng
        );
        setIsDeliverable(distance <= 15);
      } else {
        // If no coordinates set, assume deliverable (show full UI)
        setIsDeliverable(true);
      }

      setLocationChecked(true);
    };

    checkDeliverability();
  }, [userLocation]);



  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-200">
            ★
          </span>
        );
      }
    }

    return <div className="flex text-xs space-x-0.5">{stars}</div>;
  };

  // Handle cart click
  const handleCartClick = async () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      // Fetch delivery charge based on user's saved location
      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        const location = docSnap.data()?.location?.coordinates;
        const storeCoords = { lat: 10.52700579443476, lng: 76.08863395142001 };

        if (location) {
          const distance = getDistanceFromLatLonInKm(
            storeCoords.lat,
            storeCoords.lng,
            location.lat,
            location.lng
          );

          setDeliveryCharge(distance <= 5 ? 0 : 40);
        } else {
          setDeliveryCharge(40); // fallback if no location saved
        }
      } catch (error) {
        // console.error("Error fetching location for delivery charge:", error);
        setDeliveryCharge(40); // default fallback
      }

      setShowCart(true);
    }
  };


  // User Profile Component
  const UserProfile = () => (
    <div className="relative">
      <div
        onClick={() => setShowUserDropdown(!showUserDropdown)}
        className="flex items-center space-x-2 cursor-pointer group"
      >
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        ) : (
          <CgProfile className="text-2xl text-gray-700 group-hover:text-blue-600 transition-colors" />
        )}

        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Hello,</span>
          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
            {currentUser?.displayName || "My Account"}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>

      {showUserDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold">{currentUser?.displayName}</p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email}
            </p>
          </div>
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </a>
          <a
            href="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Orders
          </a>
          <a
            href="/wishlist"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Wishlist
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  // Login Modal Component
  const LoginModal = () => {
    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-[#fff] z-50 flex items-center justify-center p-4">
        <div className="bg-[#fff] border border-[#00000014] bg-opacity-90 rounded-xl w-full max-w-md shadow-xl p-6 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#000]">
              Sign in to Chinju Store
            </h2>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-[#2e978e] rounded-full p-2 text-xl flex items-center justify-center transition-colors"
            >
              <IoIosCloseCircle/>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#65D2CD] flex items-center justify-center mb-4">
              <VscAccount className="text-white text-3xl" />
            </div>

            <p className="text-center mb-6">
              Sign in to access your cart, save favorites, and check out faster!
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 border border-[#0000000f] rounded-lg py-3.5 px-4 text-white hover:bg-[#fff] transition duration-200 mb-4 shadow-sm"
            >
              <FcGoogle size={24} />
              <span className="font-medium text-[#000]">Continue with Google</span>
            </button>

            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full text-[#000] border border-[#0000000f] py-3 rounded-lg hover:bg-[#fff] hover:bg-opacity-10 hover:border-[#fff] transition duration-200 font-medium shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Cart Component
  const Cart = () => {
    if (!showCart) return null;

    const calculateTotal = () => {
      return cartItems.reduce(
        (total, item) => total + item.salePrice * item.quantity,
        0
      );
    };

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
                  <span className="font-semibold">₹{deliveryCharge}</span>
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
                  onClick={() => navigate("/order-confirm")}
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
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAF9] via-[#EEF5F3] to-[#E6F1EE] text-slate-800">
      {/* Refined Top Bar - soft gradient */}
      <div className="bg-gradient-to-r from-[#1A7E74] to-[#2CAA9E] h-1.5 w-full"></div>

      {/* Header - Desktop View - Modern & Clean */}
      <div className="hidden md:block bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100/50 shadow-sm transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="text-[#1a7e74] rounded-xl font-bold LogoFont w-[70px] transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
                alt="Chinju Store"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          {/* Delivery Info */}
          {/* Desktop View */}
          {/* // Replace the location button section with: */}
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <div className="mr-3">
              <div className="flex items-center text-sm text-gray-600">
                {/* <MapPin size={16} className="mr-1" /> */}
                <span>
                  {userLocation.coordinates
                    ? userLocation.address
                    : "Location not set"}
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300 mx-2"></div>
            <button
              onClick={() => {
                if (currentUser) {
                  navigate("/locationSetup");
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="ml-4 bg-[#1a7e74] commonFont text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-[#16675f] transition-colors duration-200"
            >
              {userLocation.coordinates ? "Change" : "Set Location"}
            </button>
          </div>
          {/* Search Bar - Floating Pill Design */}
          <div className="relative flex-1 max-w-2xl mx-auto">
            {/* Floating Label Placeholder */}
            {searchQuery === "" && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none flex text-gray-400/80 text-sm sm:text-base font-medium z-10">
                <span>Search for&nbsp;</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-[#1a7e74] font-semibold"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {/* Input Field */}
            <div className="bg-gray-100/50 hover:bg-gray-100 flex items-center gap-3 px-5 py-3.5 rounded-full border border-transparent focus-within:border-[#1a7e74]/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1a7e74]/10 transition-all duration-300 shadow-sm hover:shadow-md">
              <Search size={22} className="text-gray-400 group-focus-within:text-[#1a7e74] transition-colors" />
              <input
                type="text"
                className="bg-transparent outline-none w-full text-gray-800 placeholder-transparent font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Login and Cart */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <UserProfile />
            ) : (
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setShowLoginModal(true)}
              >
                <CgProfile className="text-2xl text-gray-700 group-hover:text-blue-600 transition-colors" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Sign in</span>
                  <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                    My Account
                  </span>
                </div>
              </div>
            )}
            <div
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={handleCartClick}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative">
                <ShoppingCart className="text-xl text-[#1a7e74]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Your</span>
                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  Cart
                </span>
              </div>
            </div>
            {/* <div className="flex items-center space-x-2 cursor-pointer group">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md relative">
                  <MdLogin className="text-xl text-[#1a7e74]" />
                </div>

                <span className="text-sm font-medium group-hover:text-blue-600 transition-colors">
                  Login
                </span>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile Header - Modernized */}
      <div className="relative md:hidden bg-gradient-to-br from-[#1A7E74] to-[#134E4A] pb-6 rounded-b-[2rem] shadow-lg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="p-5 relative z-10">
          {/* Logo & Profile Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="w-[80px] brightness-0 invert opacity-90">
              <img
                src={logowhite}
                alt="Chinju Store"
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg active:scale-95 transition-all"
                onClick={() => !currentUser && setShowLoginModal(true)}
              >
                {currentUser && currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-white/50"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  />
                ) : (
                  <CgProfile className="text-xl text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile User Dropdown - Adjusted Z-index and styling */}
          {showUserDropdown && currentUser && (
            <div className="absolute right-5 top-16 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-gray-100 origin-top-right animate-in fade-in zoom-in-95 duration-200">
              <div className="px-5 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-800">
                  {currentUser?.displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email}
                </p>
              </div>
              <div className="py-1">
                <a href="/profile" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1a7e74] transition-colors">My Profile</a>
                <a href="/orders" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1a7e74] transition-colors">My Orders</a>
                <a href="/wishlist" className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1a7e74] transition-colors">Wishlist</a>
              </div>
              <div className="border-t border-gray-50 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Delivery Info - Glass Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-5 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                 <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
                  FAST DELIVERY
                </span>
                <span className="text-teal-50/80 text-xs">to</span>
              </div>
              <div className="flex items-center text-white font-medium text-sm truncate max-w-[180px]">
                <MapPin size={14} className="mr-1 text-teal-200" />
                <span className="truncate">{userLocation.address || "Select Location"}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (currentUser) {
                  navigate("/locationSetup");
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="bg-white text-[#1a7e74] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors shadow-sm"
            >
              {userLocation.coordinates ? "CHANGE" : "SET"}
            </button>
          </div>

          {/* Search Bar - Mobile */}
          <div className="relative commonFont">
             {searchQuery === "" && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none flex text-gray-400 text-sm z-10">
                <span>Search for&nbsp;</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#1a7e74] font-semibold"
                  >
                    {words[index]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
            <div className="bg-white flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-700 shadow-lg shadow-teal-900/10 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                className="bg-transparent outline-none w-full text-gray-800 placeholder-transparent text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>



      {/* Render Modals */}
      <LoginModal />
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      {homeLoading && <HomeLoader />}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 z-0 opacity-0 bg-no-repeat">
          <img src={fff} alt="" className="w-full h-full object-cover" />
        </div>
        {!currentUser || isDeliverable ?  (
          <div className=" relative">
            {/* Hero Banner */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 mt-3 md:mt-8">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  loop={banners.length > 1}
                  className="w-full aspect-[21/9] md:aspect-[21/7] object-cover"
                >
                  {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                      <img
                        src={banner.imageBase64}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Categories Section */}
          {/* Product/Category Section */}
            <div className="max-w-[1440px] mx-auto px-4 mt-3 min-h-[300px]">
              {searchQuery && searchQuery.trim().length > 0 ? (
                // Show search results - either categories or products
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredGroupedCategories.length > 0 && (
                    <div className="mb-3">
                      <h2 className="text-2xl text-gray-900 mb-6 CategoryTitle font-bold tracking-tight">
                        Categories matching "{searchQuery}"
                      </h2>
                      {filteredGroupedCategories.map((main) => (
                        <div key={main.id} className="mb-8 pl-2">
                          <h3 className="text-xl text-gray-800 mb-4 font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#1a7e74] rounded-full inline-block"></span>
                            {main.name}
                          </h3>
                          <div className="grid md:grid-cols-6 lg:grid-cols-6 grid-cols-4 gap-4 md:gap-6">
                            {main.subcategories.map((sub) => (
                              <Link
                                to={`/category/${encodeURIComponent(sub.name)}`}
                                key={sub.id}
                                className="group flex flex-col items-center transition-all cursor-pointer"
                                onClick={() => setSelectedCategory(sub.name)}
                              >
                                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-full lg:max-w-[160px] aspect-square mb-3 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-[#1a7e74]/30 group-hover:shadow-[0_8px_24px_rgba(26,126,116,0.12)] group-hover:-translate-y-1 transition-all duration-300">
                                  <img
                                    src={sub.imageBase64 || allproduct}
                                    alt={sub.name}
                                    className="w-2/3 h-2/3 object-contain group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <span className="text-xs md:text-sm font-semibold text-center text-gray-700 group-hover:text-[#1a7e74] leading-tight transition-colors">
                                  {sub.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredProducts.length > 0 && (
                    <div>
                      <h2 className="text-2xl text-gray-900 mb-6 CategoryTitle font-bold tracking-tight">
                        Products matching "{searchQuery}"
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]
 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:border-gray-100 transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
                            onClick={(e) => navigateToProduct(product.id, e)}
                          >
                             {wishlist.some(item => item.id === product.id) && (
                                <div className="absolute top-0 right-0 z-10 p-3">
                                   <Heart size={18} className="fill-red-500 text-red-500" />
                                </div>
                             )}
                             {!wishlist.some(item => item.id === product.id) && (
                                 <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   toggleWishlist(product);
                                 }}
                                 className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 z-10"
                               >
                                 <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                               </button>
                             )}
                           
                            <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-50">
                              <img
                                src={product.imageBase64 || apple}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            
                            <div className="flex flex-col flex-grow">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-[#1a7e74] transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-xs text-gray-500 mb-2 font-medium">
                                  {product.weight}
                                </p>
                                
                                <div className="mt-auto">
                                    <div className="mb-2">{renderRating(product.rating || 0)}</div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex flex-col">
                                          <span className="font-bold text-gray-900 text-lg">
                                            ₹{product.salePrice || product.originalPrice}
                                          </span>
                                          {product.originalPrice && (
                                            <span className="text-gray-400 text-xs line-through font-medium">
                                              ₹{product.originalPrice}
                                            </span>
                                          )}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          addToCart(product);
                                        }}
                                        className="bg-gray-100 text-[#1a7e74] hover:bg-[#1a7e74] hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow active:scale-95"
                                      >
                                        Add
                                      </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 &&
                    filteredGroupedCategories.length === 0 && (
                      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                        <p className="text-gray-500">
                          We couldn't find anything for "{searchQuery}". <br/>Try checking for typos or using a different keyword.
                        </p>
                      </div>
                    )}
                </motion.div>
              ) : (
                // Normal view - show grouped categories
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {groupedCategories.map((main) => (
                    <section key={main.id} className="mb-3">
                      <div className="flex items-end gap-3 mb-2 border-b border-gray-100 pb-2">
                         <h2 className="text-2xl md:text-3xl font-bold text-gray-900 CategoryTitle tracking-tight">
                            {main.name}
                        </h2>
                      </div>
                     
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 lg:gap-6">
                        {main.subcategories.map((sub) => (
                          <Link
                            to={`/category/${encodeURIComponent(sub.name)}`}
                            key={sub.id}
                            className="group flex flex-col items-center transition-all cursor-pointer"
                            onClick={() => setSelectedCategory(sub.name)}
                          >
                            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-full aspect-square mb-3 bg-white rounded-2xl md:rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center overflow-hidden relative group-hover:border-[#1a7e74]/20 group-hover:shadow-[0_10px_25px_rgba(26,126,116,0.1)] group-hover:-translate-y-1 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src={sub.imageBase64 || allproduct}
                                    alt={sub.name}
                                    className="w-12 h-12 md:w-16 md:h-16 lg:w-2/3 lg:h-2/3 object-contain group-hover:scale-115 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <span className="text-[11px] md:text-sm font-semibold text-center text-gray-700 leading-tight group-hover:text-[#1a7e74] transition-colors line-clamp-2 px-1">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Features Section - Glassmorphism */}
            <div className="max-w-[1440px] mx-auto px-4 mt-10 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <span className="text-2xl">
                      <img
                        src="https://res.cloudinary.com/dqydgc2ky/image/upload/v1748593991/time_6953238_ejcooq.png"
                        alt="Fast Delivery"
                        className="w-10 h-10 object-contain"
                      />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                      Ultrafast Delivery
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Grocery delivery in minutes, right to your doorstep.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-green-600 shadow-sm shrink-0">
                    <span className="text-2xl">
                      <img
                        src="https://res.cloudinary.com/dqydgc2ky/image/upload/v1748594067/fresh_6718182_yftabd.png"
                        alt="Farm Fresh"
                        className="w-10 h-10 object-contain"
                      />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Farm Fresh Quality</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Sourced daily from top rated farmers & suppliers.
                    </p>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                    <span className="text-2xl">
                      <img
                        src="https://res.cloudinary.com/dqydgc2ky/image/upload/v1748594151/dollar-symbol_1151390_dikxve.png"
                        alt="Best Prices"
                        className="w-10 h-10 object-contain"
                      />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Unbeatable Prices</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Maximum savings on your daily essentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-5 text-center">
            <div>
               <img src={noLocation} alt="" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 commonFont">
              Sit Tight! We're coming soon!
            </h2>
            <p className="text-gray-600 text-lg">
              Our team is working tirelessly to bring 10 minute deliveries to
              your location.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
