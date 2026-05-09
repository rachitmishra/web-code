import React from 'react';
import { Link } from 'react-router';
import styles from './CuratedEssentials.module.css';

const CuratedEssentials: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.content}>
          <span className={styles.tag}>SYSTEM_CORE</span>
          <h2 className={styles.title}>Curated <br/>Essentials</h2>
          <p className={styles.description}>
            High-performance base layers engineered for thermoregulation and seamless mobility. The foundation of every HYPVZN kit.
          </p>
          <Link to="/" className={styles.ctaCard}>
            <div className={styles.ctaInfo}>
              <h4 className={styles.ctaTitle}>Base Layer Tech-Tee</h4>
              <p className={styles.ctaSubtitle}>AVAILABLE_IN_4_COLORWAYS</p>
            </div>
            <span className={styles.ctaIcon}>+</span>
          </Link>
        </div>
        <div className={styles.imageContainer}>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV6PgnkX--QhtlDZs0NePpvFbGfelEXXpAhHOfSbrv0J8D7X-v70A2parB-acA4uTo-HdfaP-00dHzQAROuqoQwU7hqSvHk10QZRqK1d1zcld4aHoSeEdjFypjUNSSOSMUNH7iYZKguJgoRNqGzheDUO_mQKj70NSsUwGkxUTKjNLMKb_JH1Xn6r6wY96p5f5nL1Hjb-BW5218YiIgldZpQ6ny5AIrK4j4eE3tmurVSvcqDSgK19giAOo4CtK1xjSqGBanILPiqg" 
            alt="Base Layer"
            className={styles.image}
          />
          <div className={styles.imageOverlay} />
        </div>
      </div>
    </section>
  );
};

export default CuratedEssentials;
