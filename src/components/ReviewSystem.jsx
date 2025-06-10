import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from './AuthContext';
import { Star, Upload, X } from 'lucide-react';

const ReviewSystem = ({ productId, showTitle = true }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userCanReview, setUserCanReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        let q;
        
        if (productId) {
          // Fetch reviews for a specific product
          q = query(
            reviewsRef,
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Fetch all reviews for the dashboard
          q = query(reviewsRef, orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const reviewsData = [];

        for (const reviewDoc of querySnapshot.docs) {
          const reviewData = reviewDoc.data();
          // Fetch user details
          const userDoc = await getDoc(doc(db, 'users', reviewData.userId));
          const userData = userDoc.data();

          reviewsData.push({
            id: reviewDoc.id,
            ...reviewData,
            userName: userData?.displayName || 'Anonymous',
            userEmail: userData?.email || 'N/A',
            userPhoto: userData?.photoURL || null,
            createdAt: reviewData.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
          });
        }
        console.log("review Datas", reviewsData)
        setReviews(reviewsData);

        // FIXED: Calculate average rating properly
        if (reviewsData.length > 0) {
          const totalRatings = reviewsData.reduce((acc, curr) => {
            // Ensure rating is a number
            const rating = Number(curr.rating);
            console.log("Individual rating:", rating); // Debug log
            return acc + rating;
          }, 0);
          
          const avg = totalRatings / reviewsData.length;
          console.log("Total ratings:", totalRatings, "Count:", reviewsData.length, "Average:", avg); // Debug log
          setAverageRating(Number(avg.toFixed(1)));
        } else {
          setAverageRating(0);
        }

        // FIXED: Calculate rating breakdown properly
        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach((review) => {
          const rating = Number(review.rating);
          console.log("Processing rating:", rating); // Debug log
          
          // Ensure rating is valid (1-5)
          if (rating >= 1 && rating <= 5) {
            breakdown[rating] = breakdown[rating] + 1;
          }
        });
        
        console.log("Rating breakdown:", breakdown); // Debug log
        setRatingBreakdown(breakdown);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const checkUserCanReview = async () => {
      if (!currentUser || !productId) return;

      try {
        // Check if user has purchased the product
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          where('items', 'array-contains', { id: productId })
        );
        const orderSnapshot = await getDocs(q);

        // Check if user has already reviewed
        const reviewsRef = collection(db, 'reviews');
        const reviewQuery = query(
          reviewsRef,
          where('userId', '==', currentUser.uid),
          where('productId', '==', productId)
        );
        const reviewSnapshot = await getDocs(reviewQuery);

        setUserCanReview(orderSnapshot.size > 0 && reviewSnapshot.size === 0);
      } catch (error) {
        console.error('Error checking review eligibility:', error);
      }
    };

    checkUserCanReview();
  }, [currentUser, productId]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser || !productId || rating === 0) return;

    try {
      setSubmitting(true);
      await addDoc(collection(db, 'reviews'), {
        userId: currentUser.uid,
        productId,
        rating,
        text: reviewText,
        image: selectedImage,
        createdAt: new Date()
      });

      // Reset form
      setRating(0);
      setReviewText('');
      setSelectedImage(null);
      setUserCanReview(false);

      // Refresh reviews
      window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < count ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <>
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 commonFont">
            Customer Reviews
          </h2>
        )}

        {userCanReview && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photo (optional)
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Upload className="inline-block w-4 h-4 mr-2" />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-yellow-500 mr-2">
                {averageRating}
              </span>
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="ml-2 text-gray-500 text-sm">
                ({reviews.length} reviews)
              </span>
            </div>

            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <div className="w-10 text-sm text-gray-600">{star} star</div>
                  <div className="w-full bg-gray-100 rounded h-3 mx-2">
                    <div
                      className="bg-yellow-400 h-3 rounded"
                      style={{
                        width:
                          ratingBreakdown[star] > 0
                            ? `${(ratingBreakdown[star] / reviews.length) * 100}%`
                            : '2px',
                      }}                      
                    ></div>
                  </div>
                  <div className="w-6 text-right text-sm text-gray-600">
                    {ratingBreakdown[star]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
            <div
              key={review.id}
              className="bg-white px-2 py-2 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {review.userPhoto ? (
                    <img
                      src={review.userPhoto}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-lg clamp-text">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 clamp-text">
                      {review.userName}
                    </h4>
                    <p className="text-sm text-gray-500">{review.createdAt}</p>
                  </div>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-700 clamp-text">{review.text}</p>
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="w-full max-w-md rounded-lg"
                />
              )}
            </div>
          ))}

          {reviews.length > 2 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="mt-2 text-blue-600 hover:underline"
            >
              More Reviews
            </button>
          )}

          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default ReviewSystem;