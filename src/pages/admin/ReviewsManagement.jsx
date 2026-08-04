import React, { useEffect, useState } from 'react';
import { getReviews, saveReview, deleteReview, toggleReviewVisibility } from '../../services/dataStore';
import Button from '../../components/ui/Button';
import { Star } from 'lucide-react';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [formState, setFormState] = useState({ id: '', name: '', rating: 5, text: '', visible: true });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setReviews(getReviews());
  }, []);

  const refresh = () => setReviews(getReviews());

  const handleEdit = (review) => {
    setFormState(review);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveReview({ ...formState, rating: Number(formState.rating) });
    refresh();
    setMessage('Review saved successfully.');
    setFormState({ id: '', name: '', rating: 5, text: '', visible: true });
    setIsEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this review?')) {
      deleteReview(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Star size={26} className="text-brand-gold" />
        <div>
          <h2 className="text-3xl font-serif text-brand-cream">Reviews Management</h2>
          <p className="text-brand-cream/60">Manage customer reviews and decide which feedback appears on the site.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-brand-matte border border-white/10 rounded-3xl p-6 overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-brand-cream">Review Feed</h3>
            <span className="text-sm text-brand-cream/60">{reviews.length} reviews</span>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-white/10 bg-brand-black/50 p-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-brand-cream">{review.name || 'Guest'}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-brand-cream/50">Rating: {review.rating}/5</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase text-brand-cream/70">
                    <button
                      onClick={() => handleEdit(review)}
                      className="rounded-full border border-white/10 bg-brand-gold/10 px-3 py-2 hover:bg-brand-gold/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="rounded-full border border-white/10 bg-brand-red/10 px-3 py-2 hover:bg-brand-red/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-brand-cream/75 mb-3">{review.text}</p>
                <button
                  onClick={() => {
                    toggleReviewVisibility(review.id);
                    refresh();
                  }}
                  className={`rounded-2xl px-4 py-2 text-sm ${review.visible ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-red/10 text-brand-red'}`}
                >
                  {review.visible ? 'Hide Review' : 'Show Review'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-matte border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-brand-cream mb-4">{isEditing ? 'Edit Review' : 'Add Review'}</h3>
          {message && <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-200">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-cream/70 mb-2">Reviewer Name</label>
              <input
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-brand-black px-4 py-3 text-brand-cream"
                placeholder="Customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-cream/70 mb-2">Rating</label>
              <select
                name="rating"
                value={formState.rating}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-brand-black px-4 py-3 text-brand-cream"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-cream/70 mb-2">Review Text</label>
              <textarea
                name="text"
                rows={5}
                value={formState.text}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-brand-black px-4 py-3 text-brand-cream resize-none"
                placeholder="Customer feedback"
              />
            </div>
            <label className="flex items-center gap-3 text-brand-cream/70">
              <input
                type="checkbox"
                name="visible"
                checked={formState.visible}
                onChange={handleChange}
                className="h-5 w-5 rounded border-brand-gold/50"
              />
              Show on website
            </label>
            <Button type="submit" variant="primary">Save Review</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;
