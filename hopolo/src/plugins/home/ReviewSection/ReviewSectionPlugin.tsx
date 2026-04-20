import React from 'react';
import { useHomeContext } from '../../../pages/Home/Context';
import styles from './ReviewSectionPlugin.module.css';

const ReviewSectionPlugin: React.FC = () => {
  const { settings } = useHomeContext();

  if (!settings.reviews || settings.reviews.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Loved by Customers
      </h2>
      <div className={styles.grid}>
        {settings.reviews.map((rev, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.reviewerName}>
              {rev.name} {rev.emoji}
            </div>
            <p className={styles.text}>
              "{rev.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSectionPlugin;
