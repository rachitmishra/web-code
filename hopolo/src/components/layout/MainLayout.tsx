import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import PromoBanner from '../ui/PromoBanner/PromoBanner';
import MaintenanceGuard from '../ui/Maintenance/MaintenanceGuard';
import MiniCart from '../ui/MiniCart/MiniCart';
import BottomNavBar from './BottomNavBar/BottomNavBar';
import DebugOverlay from '../ui/Debug/DebugOverlay';
import styles from './MainLayout.module.css';
import { subscribeToCart } from '../../services/cartService';
import { Link } from 'react-router';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToCart((items) => {
      const currentCount = items.reduce((acc, item) => acc + item.quantity, 0);
      if (currentCount > prevItemCount) {
        setIsCartOpen(true);
      }
      setPrevItemCount(currentCount);
    });
    return () => unsubscribe();
  }, [prevItemCount]);

  return (
    <div className={styles.container}>
      <DebugOverlay />
      <MaintenanceGuard>
        <Header onOpenCart={() => setIsCartOpen(true)} />
        
        <main className={styles.main}>
          {children}
        </main>

        <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.brandLogo}>HYPVZN</span>
              <p className={styles.brandBio}>
                ADVANCED GARMENT ENGINEERING FOR THE METROPOLITAN ENVIRONMENT. DESIGNED IN TOKYO, BUILT FOR THE FUTURE.
              </p>
            </div>
            <div className={styles.footerNav}>
              <div className={styles.navGroup}>
                <span className={styles.navTitle}>LEGAL</span>
                <nav className={styles.navList}>
                  <Link to="/legal/privacy">PRIVACY_POLICY</Link>
                  <Link to="/legal/terms">TERMS_OF_USE</Link>
                  <Link to="/shipping">SHIPPING_INFO</Link>
                </nav>
              </div>
              <div className={styles.navGroup}>
                <span className={styles.navTitle}>SOCIAL</span>
                <nav className={styles.navList}>
                  <a href="#">INSTAGRAM</a>
                  <a href="#">TWITTER_X</a>
                  <a href="#">DISCORD_LABS</a>
                </nav>
              </div>
              <div className={styles.navGroup}>
                <span className={styles.navTitle}>SUPPORT</span>
                <nav className={styles.navList}>
                  <Link to="/contact">WARRANTY_CLAIMS</Link>
                  <Link to="/about">SIZING_GUIDE</Link>
                  <Link to="/contact">CONTACT_REP</Link>
                </nav>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span className={styles.localTime}>LOCAL_TIME: 22:14 JST</span>
            <div className={styles.copyright}>
              &copy; {new Date().getFullYear()} HYPVZN. ENGINEERED FOR PRECISION.
            </div>
          </div>
        </footer>
        <BottomNavBar />
      </MaintenanceGuard>
    </div>
  );
};

export default MainLayout;
