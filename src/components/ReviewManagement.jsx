import React, { useState, useEffect } from "react";
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
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiXCircle,
} from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const ReviewManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [unreadOrderCount, setUnreadOrderCount] = useState(0);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showFullReview, setShowFullReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const handleNotificationClick = () => {
    navigate("/dashboard/orderdetails");
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsRefreshing(true);
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const reviewsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      console.log("review is", reviewsData)
      setReviews(reviewsData);
      setError("");
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews: " + err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== id)
        );
      } catch (err) {
        setError("Failed to delete review: " + err.message);
      }
    }
  };

  const handleLogout = () => {
    navigate("/login");
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
    return location.pathname === path ;
  };

  const filteredReviews = reviews
    .filter((review) => {
      // Search filter
      const matchesSearch =
        review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Rating filter
      const matchesRating = ratingFilter
        ? Number(review.rating) === ratingFilter
        : true;

      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === "newest") {
        return b.createdAt - a.createdAt;
      } else if (sortBy === "oldest") {
        return a.createdAt - b.createdAt;
      } else if (sortBy === "highest") {
        return Number(b.rating) - Number(a.rating);
      } else if (sortBy === "lowest") {
        return Number(a.rating) - Number(b.rating);
      }
      return 0;
    });

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`${
          index < numRating ? "text-yellow-400 fill-current" : "text-gray-300"
        } inline mr-1`}
        size={16}
      />
    ));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(Number(review.rating));
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
        {/* Top header */}
        <header className="flex items-center justify-between px-4 sm:px-6 h-16 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h2 className="text-base sm:text-xl font-bold text-gray-800 hidden sm:block">
              Review Management
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

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <FiStar className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <FiStar className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.length > 0
                      ? (
                          reviews.reduce(
                            (sum, review) => sum + (Number(review.rating) || 0),
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <FiTrendingUp className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      reviews.filter((review) => {
                        const reviewDate = review.createdAt;
                        const currentDate = new Date();
                        return (
                          reviewDate.getMonth() === currentDate.getMonth() &&
                          reviewDate.getFullYear() === currentDate.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <FiStar className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Verified Purchases
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviews.filter((r) => r.isVerifiedPurchase).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rating Distribution
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-10 text-sm font-medium text-gray-600">
                    {rating} Star
                  </div>
                  <div className="flex-1 mx-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (ratingDistribution[rating] / reviews.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-600">
                    {ratingDistribution[rating]} (
                    {reviews.length > 0
                      ? Math.round(
                          (ratingDistribution[rating] / reviews.length) * 100
                        )
                      : 0}
                    %)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <FiSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiFilter className="mr-2" />
                  Filters
                  {ratingFilter && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      {ratingFilter}★
                    </span>
                  )}
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={fetchReviews}
                  className="flex items-center px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                  disabled={isRefreshing}
                >
                  <FiRefreshCw
                    className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {/* Filters Dropdown */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Filter by Rating
                  </h4>
                  <button
                    onClick={() => {
                      setRatingFilter(null);
                      setShowFilters(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        setRatingFilter(rating === ratingFilter ? null : rating);
                        setShowFilters(false);
                      }}
                      className={`flex items-center px-3 py-1 rounded-full text-sm ${
                        ratingFilter === rating
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {rating} ★
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Reviews ({filteredReviews.length})
                </h3>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        User
                      </th>
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        Product
                      </th>
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        Rating
                      </th>
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        Review
                      </th>
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        Date
                      </th>
                      <th className="pb-4 font-semibold text-sm text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.map((review) => (
                      <tr
                        key={review.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {review.userName || "Anonymous"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {review.userEmail || "No email"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-800">
                          {review.productName || "N/A"}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">
                              ({review.rating || 0})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-800 max-w-xs">
                          <div
                            className={`${
                              review.text?.length > 100
                                ? "truncate cursor-pointer hover:text-blue-600"
                                : ""
                            }`}
                            onClick={() =>
                              review.text?.length > 100 &&
                              setShowFullReview(review)
                            }
                          >
                            {review.text || "No review text"}
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Review"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 sm:hidden">
                {currentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {review.userName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.userEmail || "No email"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Review"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-2 text-sm text-gray-800">
                      <strong>Product:</strong> {review.productName || "N/A"}
                    </p>

                    <div className="mt-1 flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">
                        ({review.rating || 0})
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-800">
                      <strong>Review:</strong>{" "}
                      <span
                        className={`${
                          review.text?.length > 50
                            ? "truncate cursor-pointer hover:text-blue-600"
                            : ""
                        }`}
                        onClick={() =>
                          review.text?.length > 50 && setShowFullReview(review)
                        }
                      >
                        {review.text || "No review text"}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      <strong>Date:</strong> {formatDate(review.createdAt)}
                    </p>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* No reviews */}
              {filteredReviews.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FiStar className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No reviews found</p>
                  <p className="text-gray-400 text-sm">
                    {searchTerm || ratingFilter
                      ? "Try adjusting your search or filters"
                      : "Reviews will appear here once customers start rating products"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Full Review Modal */}
      {showFullReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Full Review</h3>
              <button
                onClick={() => setShowFullReview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{showFullReview.userName}</h4>
                  <div className="flex items-center">
                    {renderStars(showFullReview.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      ({showFullReview.rating || 0})
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {showFullReview.userEmail}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Product:
                </p>
                <p className="text-gray-800">{showFullReview.productName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Review:
                </p>
                <p className="text-gray-800 whitespace-pre-line">
                  {showFullReview.text}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Date:</p>
                <p className="text-gray-800">
                  {formatDate(showFullReview.createdAt)}
                </p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowFullReview(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default ReviewManagement;