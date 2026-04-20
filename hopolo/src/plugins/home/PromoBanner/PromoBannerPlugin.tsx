import React from 'react';
import { useHomeContext } from '../../../pages/Home/Context';
import styles from './PromoBannerPlugin.module.css';

const PromoBannerPlugin: React.FC = () => {
  const { settings } = useHomeContext();

  if (!settings || !settings.bannerVisible || !settings.bannerText) {
    return null;
  }

  const bannerContent = (
    <div 
      className={styles.banner} 
      style={{ backgroundColor: settings.bannerColor || 'var(--color-primary)' }}
    >
      {settings.bannerText}
    </div>
  );

  if (settings.bannerLink) {
    return (
      <a href={settings.bannerLink} className={styles.bannerLink}>
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
};

export default PromoBannerPlugin;
