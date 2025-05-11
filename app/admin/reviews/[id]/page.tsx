'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function ReviewDetail({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadReview();
  }, [isAuthenticated, router, params.id]);

  const loadReview = async () => {
    try {
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', params.id)
        .single();

      if (reviewError) throw reviewError;

      if (reviewData) {
        setReview(reviewData);

        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', reviewData.product_id)
          .single();

        if (productError) throw productError;
        if (productData) {
          setProduct(productData);
        }
      }
    } catch (error) {
      console.error('Error loading review:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (status: Review['status']) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', params.id);

      if (error) throw error;

      setReview(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!review || !product) {
    return <div>Review not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Review Details</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => updateReviewStatus('approved')}
                disabled={saving || review.status === 'approved'}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => updateReviewStatus('rejected')}
                disabled={saving || review.status === 'rejected'}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Product</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Rating</h2>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Comment</h2>
              <p className="text-gray-700">{review.comment}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  review.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : review.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Date</h2>
              <p className="text-gray-600">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 