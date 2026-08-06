import { useState } from 'react';
import { motion } from 'framer-motion';
import { getReviews, saveReview } from '../services/dataStore';
import { Star, CheckCircle2, Sparkles, MessageSquarePlus } from 'lucide-react';

const StarRatingDisplay = ({ rating }) => {
  return (
    <div className="flex items-center gap-1 text-[#FFD700]">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-white/20'}
        />
      ))}
    </div>
  );
};

const StarInputInteractive = ({ rating, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= (hoverRating || rating);

        return (
          <motion.button
            key={starValue}
            type="button"
            whileTap={{ scale: 1.3 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 focus:outline-none transition-transform"
            aria-label={`${starValue} Star Review`}
          >
            <Star
              size={32}
              className={`transition-colors ${
                active
                  ? 'fill-[#FFD700] text-[#FFD700] drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]'
                  : 'text-brand-cream/30 hover:text-brand-cream/60'
              }`}
            />
          </motion.button>
        );
      })}
      <span className="ml-2 text-xs font-bold text-[#FFD700]">
        {rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''}` : 'Tap stars to rate'}
      </span>
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState(() => getReviews().filter((review) => review.visible !== false));
  const [formState, setFormState] = useState({ name: '', rating: 5, text: '', product: 'Andhra Avakaya Mango Pickle' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!formState.rating || formState.rating < 1) {
      setError('Please select a star rating.');
      return;
    }
    if (!formState.text.trim()) {
      setError('Please enter your review text.');
      return;
    }

    setError('');
    saveReview({
      name: formState.name.trim(),
      rating: formState.rating,
      text: formState.text.trim(),
      product: formState.product,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      visible: true
    });

    setReviews(getReviews().filter((review) => review.visible !== false));
    setFormState({ name: '', rating: 5, text: '', product: 'Andhra Avakaya Mango Pickle' });
    setMessage('🎉 Thank you! Your review has been published.');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="flex-grow bg-[#F8F3E8] py-12 text-[#5C4033] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1E1E]/10 text-[#8B1E1E] text-xs uppercase font-bold tracking-widest">
            <Sparkles size={14} className="text-[#D97706] animate-pulse" /> Genuine Feedback
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#5C4033]">
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm sm:text-base text-[#5C4033]/80">
            Real experiences from thousands of homes enjoying Vasuki Pickles across India.
          </p>
        </div>

        {/* ALWAYS-VISIBLE Review Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-[#D97706]/30 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-[#5C4033]/10 pb-4">
            <div className="p-2.5 rounded-2xl bg-[#8B1E1E] text-white">
              <MessageSquarePlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#5C4033]">Write a Review</h2>
              <p className="text-xs text-[#5C4033]/70">Share your tasting experience with our pickles & podis.</p>
            </div>
          </div>

          {message && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> {message}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name input */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Rao"
                  className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all"
                />
              </div>

              {/* Product selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                  Pickle / Product Tried
                </label>
                <select
                  name="product"
                  value={formState.product}
                  onChange={handleChange}
                  className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all"
                >
                  <option value="Andhra Avakaya Mango Pickle">Andhra Avakaya Mango Pickle</option>
                  <option value="Gongura Garlic Pickle">Gongura Garlic Pickle</option>
                  <option value="Boneless Chicken Pickle">Boneless Chicken Pickle</option>
                  <option value="Spicy Royal Prawns Pickle">Spicy Royal Prawns Pickle</option>
                  <option value="Andhra Mutton Pickle">Andhra Mutton Pickle</option>
                  <option value="Traditional Idli Karam Podi">Traditional Idli Karam Podi</option>
                  <option value="Groundnut Chutney Podi">Groundnut Chutney Podi</option>
                </select>
              </div>
            </div>

            {/* Interactive Gold Star Rating */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                Star Rating *
              </label>
              <StarInputInteractive
                rating={formState.rating}
                onChange={(val) => setFormState((prev) => ({ ...prev, rating: val }))}
              />
            </div>

            {/* Review text input */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#5C4033] mb-2">
                Your Review / Tasting Feedback *
              </label>
              <textarea
                name="text"
                rows={4}
                required
                value={formState.text}
                onChange={handleChange}
                placeholder="Write your honest thoughts about spice level, freshness, aroma, oil quality..."
                className="w-full bg-[#F8F3E8]/80 border-2 border-[#5C4033]/15 rounded-2xl px-4 py-3 text-sm text-[#5C4033] font-medium focus:outline-none focus:border-[#8B1E1E] focus:bg-white transition-all resize-none"
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#8B1E1E] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              Submit My Review
            </motion.button>
          </form>
        </motion.div>

        {/* Existing Customer Reviews Grid */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-serif font-bold text-[#5C4033]">Recent Verified Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <motion.div
                key={rev.id || idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-[22px] bg-white border border-[#5C4033]/12 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StarRatingDisplay rating={rev.rating} />
                    <span className="text-[10px] font-bold text-[#556B2F] bg-[#556B2F]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>
                  <p className="text-sm text-[#5C4033] leading-relaxed italic">"{rev.text}"</p>
                </div>

                <div className="pt-4 border-t border-[#5C4033]/10 mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#5C4033]">{rev.name}</h3>
                    <p className="text-xs text-[#556B2F] font-semibold">{rev.product}</p>
                  </div>
                  <span className="text-[11px] text-[#5C4033]/50">{rev.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reviews;
