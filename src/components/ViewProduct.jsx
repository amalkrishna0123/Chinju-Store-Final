import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Image,
  ArrowLeft
} from 'lucide-react';
import { 
  FiEdit2, 
  FiTrash2, 
  FiArrowLeft, 
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiImage,
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser, 
  FiShoppingBag, 
  FiLayers, 
  FiGrid,
  FiBell,
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiStar
} from 'react-icons/fi';
import { MdDeliveryDining, MdReviews } from "react-icons/md";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../Firebase';
import { collection, getDocs, deleteDoc, doc, query, where, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import * as XLSX from 'xlsx';
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";
import { SiTicktick } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";

const ViewProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState({
    main: [],
    sub: [],
    subsub: [],
  });
  const [excelData, setExcelData] = useState([]);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [isUploadingToFirebase, setIsUploadingToFirebase] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  // In the state section, add filter state variables:
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [discountFilter, setDiscountFilter] = useState("all");

  const handleFileUploadClick = () => {
    alert(
      "Please make sure the Excel file follows this format:\n\n" +
        "1. Column 'Name' (required): The name of the product.\n" +
        "2. Column 'Brand' (optional): The brand of the product.\n" +
        "3. Column 'OriginalPrice' (required): The original price.\n" +
        "4. Column 'Offer' (optional): The discount percentage.\n" +
        "5. Column 'Description' (optional): Product description.\n" +
        "6. Column 'Category' (optional): Main category.\n" +
        "7. Column 'SubCategory' (optional): Subcategory.\n" +
        "8. Column 'SubSubCategory' (optional): Sub-subcategory.\n" +
        "9. Column 'Weight' (optional): Product weight/number.\n" +
        "10. Column 'ShelfLife' (optional): Shelf life in days.\n" +
        "11. Column 'Imported' (optional): 'Yes' or 'No'.\n" +
        "12. Column 'Organic' (optional): 'Yes' or 'No'.\n" +
        "13. Column 'Stock' (optional): 'Available' or 'Out of Stock'."
    );
    document.getElementById("excel-file-input").click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      if (parsedData.length === 0) {
        alert("No data in the Excel file.");
        e.target.value = "";
        return;
      }

      setExcelData(parsedData);
      alert(
        `Successfully imported ${parsedData.length} products from Excel. Click "Upload to Database" to save them.`
      );
      e.target.value = "";
    };

    reader.readAsArrayBuffer(file);
    setIsUploadingExcel(true);
  };

  const uploadExcelDataToFirebase = async () => {
    if (!excelData.length) {
      alert("No data to upload");
      return;
    }

    setIsUploadingToFirebase(true);
    setError("");

    try {
      const productsCollection = collection(db, "products");
      const existingSnapshot = await getDocs(productsCollection);
      const existingProducts = existingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let successCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      for (const item of excelData) {
        const name = (item.Name || item.name || "").trim().toLowerCase();
        const weight = (item.Weight || item.weight || "").trim().toLowerCase();
        const originalPrice = Number(
          item.OriginalPrice || item.originalPrice || 0
        );

        if (!name || !weight || !originalPrice) {
          console.warn(`Skipping invalid product: ${item.Name}`);
          continue;
        }

        const existingProduct = existingProducts.find(
          (prod) =>
            prod.name.trim().toLowerCase() === name &&
            prod.weight.trim().toLowerCase() === weight
        );

        const offer = Number(item.Offer || item.offer || 0);
        const salePrice = originalPrice - (originalPrice * offer) / 100;

        const productData = {
          name: item.Name || item.name || "",
          brand: item.Brand || item.brand || "",
          originalPrice,
          offer,
          salePrice,
          description: item.Description || item.description || "",
          category: item.Category || item.category || "",
          subCategory: item.SubCategory || item.subCategory || "",
          subSubCategory: item.SubSubCategory || item.subSubCategory || "",
          weight: item.Weight || item.weight || "",
          shelfLife: item.ShelfLife || item.shelfLife || "",
          imported: item.Imported || item.imported || "No",
          organic: item.Organic || item.organic || "No",
          stock: item.Stock || item.stock || "Available",
          createdAt: new Date().toISOString(),
          categoryHierarchy: {
            main: item.Category || item.category || "",
            sub: item.SubCategory || item.subCategory || "",
            subsub: item.SubSubCategory || item.subSubCategory || "",
          },
          fullCategoryPath: [
            item.Category || item.category,
            item.SubCategory || item.subCategory,
            item.SubSubCategory || item.subSubCategory,
          ]
            .filter(Boolean)
            .join(" → "),
        };

        if (existingProduct) {
          if (existingProduct.originalPrice !== originalPrice) {
            await updateDoc(
              doc(db, "products", existingProduct.id),
              productData
            );
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          await addDoc(productsCollection, productData);
          successCount++;
        }
      }

      alert(`Upload complete!
✅ Added: ${successCount}
🔁 Updated: ${updatedCount}
⏭️ Skipped (no change): ${skippedCount}`);

      await fetchProducts();
      setExcelData([]);
      setFileInputKey(Date.now());
    } catch (err) {
      console.error("Error uploading Excel data:", err);
      setError("Failed to upload Excel data: " + err.message);
    } finally {
      setIsUploadingToFirebase(false);
      setIsUploadingExcel(false);
    }
  };

  const handleCancelExcelImport = () => {
    setExcelData([]);
    setFileInputKey(Date.now());
    setIsUploadingExcel(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    setupUnreadOrdersListener();
  }, []);

  // Add this useEffect to close the dropdown when clicking outside:
  useEffect(() => {
    const handleClickOutside = () => {
      const dropdown = document.getElementById("filterDropdown");
      if (dropdown && !dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const mainQuery = query(
        collection(db, "categories"),
        where("type", "==", "main")
      );
      const subQuery = query(
        collection(db, "categories"),
        where("type", "==", "sub")
      );
      const subSubQuery = query(
        collection(db, "categories"),
        where("type", "==", "subsub")
      );

      const [mainSnapshot, subSnapshot, subSubSnapshot] = await Promise.all([
        getDocs(mainQuery),
        getDocs(subQuery),
        getDocs(subSubQuery),
      ]);

      setCategories({
        main: mainSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        sub: subSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        subsub: subSubSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Real-time listener for unread orders
  const setupUnreadOrdersListener = () => {
    const unreadQuery = query(
      collection(db, "orders"),
      where("isRead", "==", false)
    );

    return onSnapshot(unreadQuery, (snapshot) => {
      setUnreadOrderCount(snapshot.docs.length);
    });
  };

  const fetchProducts = async () => {
    try {
      setIsRefreshing(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      const productData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const offer = data.offer || "";
        const salePrice = offer ? data.salePrice : data.originalPrice;

        return {
          id: doc.id,
          ...data,
          offer,
          salePrice,
        };
      });
      setProducts(productData);
      setError("");
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts((prev) => prev.filter((product) => product.id !== id));
      } catch (err) {
        setError("Failed to delete product: " + err.message);
      }
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleNotificationClick = () => {
    navigate("/dashboard/orderdetails");
  };

  const handleExportExcel = () => {
    // Prepare data for export including image info (not full base64)
    const exportData = products.map((product) => {
      // Create image info objects that won't exceed cell limits
      const mainImageInfo = product.imageBase64
        ? `[Image: ${product.imageBase64.substring(0, 50)}... (truncated)]`
        : "No main image";

      const subImagesInfo =
        Array.isArray(product.subImagesBase64) &&
        product.subImagesBase64.length > 0
          ? `${product.subImagesBase64.length} sub images`
          : "No sub images";

      return {
        Name: product.name || "",
        Brand: product.brand || "",
        OriginalPrice: product.originalPrice || 0,
        Offer: product.offer || 0,
        SalePrice: product.salePrice || product.originalPrice || 0,
        Description: product.description || "",
        Category: product.categoryHierarchy?.main || product.category || "",
        SubCategory:
          product.categoryHierarchy?.sub || product.subCategory || "",
        SubSubCategory:
          product.categoryHierarchy?.subsub || product.subSubCategory || "",
        Weight: product.weight || "",
        ShelfLife: product.shelfLife || "",
        PackedDate: product.packedDate || "",
        ExpiryDate: product.expiryDate || "",
        Imported: product.imported || "No",
        Organic: product.organic || "No",
        Stock: product.stock || "Available",
        CreatedAt: product.createdAt || new Date().toISOString(),
        "Has Main Image": product.imageBase64 ? "Yes" : "No",
        "Number of Sub Images": Array.isArray(product.subImagesBase64)
          ? product.subImagesBase64.length
          : 0,
        "Main Image Info": mainImageInfo,
        "Sub Images Info": subImagesInfo,
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 8 },
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
      { wch: 20 },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // Generate file and download
    XLSX.writeFile(
      wb,
      `products_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FiGrid /> },
    {
      label: "Categories",
      path: "/dashboard/view-category",
      icon: <FiLayers />,
    },
    {
      label: "Products",
      path: "/dashboard/view-product",
      icon: <FiShoppingBag />,
    },
    { label: "Banners", path: "/dashboard/view-banner", icon: <FiImage /> },
    {
      label: "Orders",
      path: "/dashboard/orderdetails",
      icon: <FiShoppingCart />,
    },
    { label: "Users", path: "/dashboard/users", icon: <FiUsers /> },
    {
      label: "Delivery Boys",
      path: "/dashboard/delivery-boys",
      icon: <MdDeliveryDining />,
    },
    { label: "Reviews", path: "/dashboard/reviewmanagement", icon: <FiStar /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Update the filteredProducts logic:
  const filteredProducts = products
    .filter((product) =>
      (product.name || product.productName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      if (filterType === "all") return true;
      if (filterType === "category") {
        return (
          product.categoryHierarchy?.main === filterValue ||
          product.category === filterValue
        );
      }
      if (filterType === "subCategory") {
        return (
          product.categoryHierarchy?.sub === filterValue ||
          product.subCategory === filterValue
        );
      }
      if (filterType === "subSubCategory") {
        return (
          product.categoryHierarchy?.subsub === filterValue ||
          product.subSubCategory === filterValue
        );
      }
      return true;
    })
    .filter((product) => {
      if (brandFilter === "all") return true;
      return (product.brand || "").toLowerCase() === brandFilter.toLowerCase();
    })
    .filter((product) => {
      if (discountFilter === "all") return true;
      if (discountFilter === "withDiscount") return product.offer > 0;
      if (discountFilter === "withoutDiscount")
        return !product.offer || product.offer === 0;
      return true;
    });

  // Helper function to get full category hierarchy
  const getCategoryHierarchy = (product) => {
    let hierarchy = [];

    // Find main category
    const mainCategory = categories.main.find(
      (cat) => cat.id === product.category
    );
    if (mainCategory) {
      hierarchy.push(mainCategory.name);
    }

    // Find subcategory
    const subCategory = categories.sub.find(
      (cat) => cat.id === product.subCategory
    );
    if (subCategory) {
      hierarchy.push(subCategory.name);
    }

    // Find sub-subcategory
    const subSubCategory = categories.subsub.find(
      (cat) => cat.id === product.subSubCategory
    );
    if (subSubCategory) {
      hierarchy.push(subSubCategory.name);
    }

    // Fallback to old category field if no hierarchy found
    if (hierarchy.length === 0 && product.category) {
      hierarchy.push(product.category);
    }

    return hierarchy.join(" → ") || "—";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-slate-200 overflow-auto transition-all duration-300 ease-in-out z-20 ${
          sidebarOpen ? "translate-x-0 w-80 sm:w-80" : "-translate-x-full w-0"
        } lg:translate-x-0 lg:w-80 lg:top-0 lg:h-screen lg:block`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="text-xl font-bold text-white">AdminPanel</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div
                className={`text-lg ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {item.icon}
              </div>
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <FiLogOut size={18} />
            <span className="ml-3 text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[300px]">
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">
              Products
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FiBell size={20} className="text-gray-600" />
                {unreadOrderCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                    {unreadOrderCount}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <FiUser size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  Admin User
                </span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/dashboard/add-product"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus size={16} className="mr-2" />
              Add New Product
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex items-center w-full max-w-xs">
                  <FiSearch
                    className="absolute left-3 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    <PiMicrosoftExcelLogoBold size={16} />
                    Import from Excel
                  </button>
                  <input
                    id="excel-file-input"
                    key={fileInputKey}
                    type="file"
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  {isUploadingExcel && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={uploadExcelDataToFirebase}
                        disabled={isUploadingToFirebase}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                          isUploadingToFirebase
                            ? "bg-gray-100 text-gray-700 cursor-not-allowed"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {isUploadingToFirebase ? (
                          <>
                            <FiRefreshCw className="animate-spin" size={14} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <SiTicktick size={14} />
                            Upload to Database
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelExcelImport}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                      >
                        <RxCross2 size={14} />
                        Cancel
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    <PiMicrosoftExcelLogoBold size={16} />
                    Export to Excel
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={fetchProducts}
                    disabled={isRefreshing}
                  >
                    <FiRefreshCw
                      size={16}
                      className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById("filterDropdown")
                          .classList.toggle("hidden");
                      }}
                    >
                      <FiFilter size={16} className="mr-2" />
                      Filter
                    </button>
                    <div
                      id="filterDropdown"
                      className="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <div className="mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            onChange={(e) => {
                              setFilterType("category");
                              setFilterValue(e.target.value);
                            }}
                          >
                            <option value="">All Categories</option>
                            {categories.main.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Sub Category
                          </label>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            onChange={(e) => {
                              setFilterType("subCategory");
                              setFilterValue(e.target.value);
                            }}
                          >
                            <option value="">All Sub Categories</option>
                            {categories.sub.map((sub) => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Sub Sub Category
                          </label>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            onChange={(e) => {
                              setFilterType("subSubCategory");
                              setFilterValue(e.target.value);
                            }}
                          >
                            <option value="">All Sub Sub Categories</option>
                            {categories.subsub.map((subsub) => (
                              <option key={subsub.id} value={subsub.name}>
                                {subsub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Brand
                          </label>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            onChange={(e) => setBrandFilter(e.target.value)}
                          >
                            <option value="all">All Brands</option>
                            {[
                              ...new Set(
                                products.map((p) => p.brand).filter(Boolean)
                              ),
                            ].map((brand) => (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Discount
                          </label>
                          <select
                            className="w-full p-1 border border-gray-300 rounded text-sm"
                            onChange={(e) => setDiscountFilter(e.target.value)}
                          >
                            <option value="all">All Products</option>
                            <option value="withDiscount">With Discount</option>
                            <option value="withoutDiscount">
                              Without Discount
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FiImage size={48} className="mb-4 text-gray-300" />
                {searchTerm
                  ? "No products found matching your search."
                  : "No products found. Add your first product!"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub Images
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sub Sub Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight/Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="h-16 w-16 rounded-lg overflow-hidden">
                            <img
                              src={product.imageBase64}
                              alt={product.name || product.productName}
                              className="h-full w-full object-cover cursor-pointer"
                              onClick={() =>
                                setPreviewImage(product.imageBase64)
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {Array.isArray(product.subImagesBase64) &&
                          product.subImagesBase64.length > 0 ? (
                            <div className="w-32 relative">
                              <Swiper
                                spaceBetween={5}
                                slidesPerView={2}
                                modules={[Navigation]}
                                navigation={true}
                                className="subimages-swiper"
                              >
                                {product.subImagesBase64.map((subImg, idx) => (
                                  <SwiperSlide key={idx}>
                                    <div className="h-12 w-12 rounded overflow-hidden">
                                      <img
                                        src={subImg}
                                        alt={`${
                                          product.name || product.productName
                                        }-${idx + 1}`}
                                        className="h-full w-full object-cover cursor-pointer"
                                        onClick={() => setPreviewImage(subImg)}
                                      />
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {product.name || product.productName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {getCategoryHierarchy(product)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {product.categoryHierarchy?.sub ||
                            product.subCategory ||
                            "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {product.categoryHierarchy?.subsub ||
                            product.subSubCategory ||
                            "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {product.brand || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            ₹{product.originalPrice}
                          </div>
                          {product.offer && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-green-600 font-medium mr-1">
                                {product.offer}% OFF
                              </span>
                              <span className="text-xs text-gray-500">
                                ₹{product.salePrice}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {product.weight || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-500">
                            {product.organic === "Yes" ||
                            product.organic === true ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-1">
                                Organic
                              </span>
                            ) : (
                              "-"
                            )}
                            {product.imported === "Yes" ||
                            product.imported === true ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Imported
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              to={`/dashboard/edit-product/${product.id}`}
                              className="flex items-center text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex items-center text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                products
              </div>
            </div>
          </div>

          {/* Image Preview Modal */}
          {previewImage && (
            <div
              className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
              onClick={() => setPreviewImage(null)}
            >
              <div
                className="relative bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-lg font-bold"
                >
                  ✕
                </button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Overlay for when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm md:backdrop-blur-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ViewProduct;