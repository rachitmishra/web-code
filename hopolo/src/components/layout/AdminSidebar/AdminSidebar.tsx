import React from 'react';
import { NavLink } from 'react-router';
import { 
  Package, 
  Store, 
  Megaphone, 
  Palette, 
  Layout,
  BarChart3, 
  Mail, 
  History, 
  Leaf,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}

const navItems = [
  { path: '/admin/orders', label: 'Orders', icon: <Package size={20} /> },
  { path: '/admin/inventory', label: 'Inventory', icon: <Store size={20} /> },
  { path: '/admin/marketing', label: 'Marketing', icon: <Megaphone size={20} /> },
  { path: '/admin/storefront', label: 'Storefront', icon: <Palette size={20} /> },
  { path: '/admin/pages', label: 'Static Pages', icon: <Layout size={20} /> },
  { path: '/admin/pdp', label: 'PDP Layout', icon: <Layout size={20} /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { path: '/admin/invitations', label: 'Invitations', icon: <Mail size={20} /> },
  { path: '/admin/email-logs', label: 'Email Logs', icon: <History size={20} /> },
  { path: '/admin/seed', label: 'Seed Data', icon: <Leaf size={20} /> },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle, onItemClick }) => {
  return (
    <aside 
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
    >
      <div className={styles.logoWrapper}>
        <h1 className={styles.logo}>KINETIC_BRUTAL</h1>
        <p className={styles.version}>ADMIN_V1.0</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick?.();
            }}
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/logout" className={styles.navLink}>
          <span className={`material-symbols-outlined ${styles.icon}`}>logout</span>
          <span className={styles.label}>LOGOUT</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
