import React, { useState } from 'react';
import Button from '../../../components/ui/Button/Button';
import styles from './ReviewsPlugin.module.css';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
}

interface ReviewsPluginProps {
  reviews: Review[];
  user?: any;
  onAddReview: (rating: number, comment: string) => void;
  onSignIn?: () => void;
  submitting?: boolean;
}

const ReviewsPlugin: React.FC<ReviewsPluginProps> = ({
  reviews,
  user,
  onAddReview,
  onSignIn,
  submitting
}) => {
  const [newRating, setNewRating] = useState<number>(3);
  const [newComment, setNewComment] = useState('');

  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 3: return '😊';
      case 2: return '😐';
      case 1: return '😞';
      default: return '❓';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(newRating, newComment);
    setNewComment('');
    setNewRating(3);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Customer Reviews</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                {review.userName} {getRatingEmoji(review.rating)}
              </div>
              <p className={styles.reviewText}>{review.comment}</p>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet. Be the first to review!</p>
        )}
      </div>

      {user ? (
        <form className={styles.addReviewForm} onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          <div className={styles.emojiSelector}>
            {[3, 2, 1].map((r) => (
              <button
                key={r}
                type="button"
                className={`${styles.ratingBtn} ${newRating === r ? styles.activeRating : ''}`}
                onClick={() => setNewRating(r)}
              >
                {getRatingEmoji(r)}
              </button>
            ))}
          </div>
          <textarea
            className={styles.reviewComment}
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <Button type="submit" loading={submitting} style={{ width: 'fit-content' }}>
            Submit Review
          </Button>
        </form>
      ) : (
        <p style={{ marginTop: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
          Please{' '}
          <Button variant="link" onClick={onSignIn} style={{ padding: 0, height: 'auto' }}>
            sign in
          </Button>{' '}
          to leave a review.
        </p>
      )}
    </section>
  );
};

export default ReviewsPlugin;
