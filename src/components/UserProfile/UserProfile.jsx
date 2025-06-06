import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import { useSelector } from 'react-redux';
import { Rating } from '@mui/material';
import { format } from 'date-fns';

const UserProfile = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        if (!user?.uid) return;

        const reviewsRef = collection(db, 'reviews');
        const q = query(
          reviewsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));

        setUserReviews(reviews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setError('Failed to fetch your reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  if (loading) {
    return <div className="text-center py-4">Loading your reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!userReviews.length) {
    return (
      <div className="text-center py-4 text-gray-600">
        You haven't written any reviews yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Reviews</h2>
      <div className="space-y-4">
        {userReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Rating
                  value={review.rating}
                  readOnly
                  size="small"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {format(review.createdAt, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <p className="text-gray-700">{review.text}</p>
            <div className="mt-2 text-sm text-gray-500">
              Product: {review.productName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;