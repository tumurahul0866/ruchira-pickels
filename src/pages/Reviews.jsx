import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getReviews, saveReview, getProducts } from '../services/dataStore';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, Sparkles, LogIn, Send } from 'lucide-react';

const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 text-[#FFD700]">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-stone-300'}
        />
      ))}
    </div>
  );
};

const StarInputInteractive = ({ rating, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= (hoverRating || rating);

        return (
          <motion.button
            key={starValue}
            type="button"
            whileTap={{ scale: 1.25 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 focus:outline-none transition-transform cursor-pointer"
            aria-label={`${starValue} Star Rating`}
          >
            <Star
              size={30}
              className={`transition-colors ${
                active
                  ? 'fill-[#FFD700] text-[#FFD700] drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]'
                  : 'text-[#5C4033]/25 hover:text-[#5C4033]/50'
              }`}
            />
          </motion.button>
        );
      })}
      <span className="ml-2 text-xs font-bold text-[#8B1E1E]">
        {rating > 0 ? `${rating} / 5 Stars` : 'Select stars'}
      </span>
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [productList, setProductList] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch products for dropdown
    const loadProducts = async () => {
      try {
        const prods = await getProducts();
        if (Array.isArray(prods) && prods.length > 0) {
          setProductList(prods);
          setSelectedProduct(prods[0].name || '');
        }
      } catch (e) {
        // fallback
      }
    };
    loadProducts();
  }, []);

  const loadReviewsList = () => {
    const allReviews = getReviews();
    const visibleReviews = allReviews.filter((r) => r.visible !== false);
    setReviews(visibleReviews);
  };

  useEffect(() => {
    loadReviewsList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/reviews' } } });
      return;
    }

    if (!rating || rating < 1) {
      setErrorMessage('Please select a star rating (1–5 stars).');
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage('Please write your review before submitting.');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);

    try {
      saveReview({
        name: user.name || user.email || 'Valued Customer',
        rating,
        text: reviewText.trim(),
        product: selectedProduct || 'Konasema Pickle',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        visible: true,
        verifiedBuyer: true,
        user_id: user.id,
        user_email: user.email,
      });

      setSuccessMessage('🎉 Thank you! Your review has been submitted successfully.');
      setReviewText('');
      setRating(5);
      loadReviewsList();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-[#F8F3E8] py-10 md:py-16 text-[#5C4033] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Heading (Requirement 3) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E] text-xs uppercase font-extrabold tracking-[0.25em]">
            <Sparkles size={14} className="text-[#D97706]" /> OUR REVIEWS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#5C4033] tracking-tight">
            What Our Customers Say
          </h1>
          <p className="text-sm sm:text-base text-[#5C4033]/80 font-medium">
            Real stories. Genuine love. Trusted by our customers.
          </p>
        </div>

        {/* Existing Customer Reviews Grid (Requirement 4) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#5C4033]/15 pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C4033]">
              Customer Experiences ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-[#5C4033]/10 p-8">
              <p className="text-[#5C4033]/70 text-sm">No reviews published yet. Be the first to write a review below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev, idx) => {
                const initial = (rev.name || 'C').charAt(0).toUpperCase();
                return (
                  <motion.div
                    key={rev.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 rounded-[22px] bg-white border border-[#5C4033]/15 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StarRatingDisplay rating={rev.rating || 5} />
                        {rev.verifiedBuyer !== false && (
                          <span className="text-[10px] font-bold text-[#556B2F] bg-[#556B2F]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={12} /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#5C4033] leading-relaxed italic">
                        "{rev.text}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#5C4033]/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1E1E] to-[#5C4033] text-[#F8F3E8] font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-sm border border-[#D97706]/30">
                          {initial}
                        </div>
                        <div>
                          <h3 className="text-sm font-serif font-bold text-[#5C4033] leading-tight">
                            {rev.name}
                          </h3>
                          {rev.product && (
                            <p className="text-xs text-[#556B2F] font-semibold leading-tight mt-0.5">
                              {rev.product}
                            </p>
                          )}
                        </div>
                      </div>
                      {rev.date && (
                        <span className="text-[11px] font-medium text-[#5C4033]/60 shrink-0">
                          {rev.date}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* WRITE A REVIEW Section (Requirement 5, 6, 7, 8) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-[#D97706]/30 rounded-3xl p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-6"
        >
          <div className="text-center space-y-1 border-b border-[#5C4033]/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#8B1E1E] uppercase tracking-wider">
              WRITE A REVIEW
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4033]/70 font-medium">
              Share your tasting experience with our authentic pickles & podis.
            </p>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-sm font-semibold">
              {errorMessage}
            </div>
          )}

          {user ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selection */}
              {productList.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                    Select Product / Pickle
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-semibold focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all"
                  >
                    {productList.map((prod) => (
                      <option key={prod.id || prod.name} value={prod.name}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* YOUR RATING */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                  YOUR RATING *
                </label>
                <StarInputInteractive rating={rating} onChange={setRating} />
              </div>

              {/* YOUR REVIEW */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                  YOUR REVIEW *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all resize-none placeholder-[#5C4033]/45"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="w-full py-3.5 px-8 rounded-full bg-[#8B1E1E] hover:bg-[#A52020] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} /> SUBMIT REVIEW
              </motion.button>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-[#F8F3E8] border border-[#5C4033]/15 text-center space-y-3">
              <p className="text-sm text-[#5C4033] font-medium">
                Please sign in to submit a review for Konasema Ruchulu pickles.
              </p>
              <Link
                to="/login"
                state={{ from: { pathname: '/reviews' } }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#8B1E1E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A52020] transition-all shadow-sm"
              >
                <LogIn size={15} /> Sign In to Submit Review
              </Link>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Reviews;
