import React from 'react';
import { NavLink } from 'react-router';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import styles from './BottomNavBar.module.css';

const BottomNavBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink 
        to="/" 
        className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
      >
        <Home size={24} />
      </NavLink>
      <NavLink 
        to="/search" 
        className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
      >
        <Search size={24} />
      </NavLink>
      <NavLink 
        to="/cart" 
        className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
      >
        <ShoppingBag size={24} />
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
      >
        <User size={24} />
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;
