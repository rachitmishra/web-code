import React from 'react';
import Button from '../Button/Button';
import styles from './CinematicHero.module.css';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  ctaText: string;
  onCtaClick: () => void;
}

const CinematicHero: React.FC<CinematicHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <span className={styles.systemTag}>FW24_SYSTEM_READY</span>
        <h1 className={styles.title}>{title}</h1>
        <Button
          variant="outline"
          className={styles.cta}
          onClick={onCtaClick}
        >
          {ctaText}
          <span className={styles.ctaIcon}>arrow_forward</span>
        </Button>
      </div>

      <div className={styles.metadataLeft}>
        [ LAT: 35.6895° N ] [ LONG: 139.6917° E ]
      </div>
      <div className={styles.metadataRight}>
        <div className={styles.divider} />
        <span className={styles.scrollTag}>SCROLL_FOR_INTEL</span>
      </div>
    </section>
  );
};

export default CinematicHero;
