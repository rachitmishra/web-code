import React from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './Success.module.css';
import { type Order } from '../services/orderService';

export { loader } from './Success.server';

const Success: React.FC = () => {
  const { order } = useLoaderData() as { order: Order | null };
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <section className={styles.successHeader}>
        <div className={styles.indicatorBlock}>
          <p className={styles.systemStatus}>SYSTEM.TRANSACTION.STATUS: SUCCESS</p>
          <h1 className={styles.title}>TRANSACTION SUCCESSFUL</h1>
        </div>
      </section>

      <div className={styles.mainGrid}>
        <div className={styles.logisticsCol}>
          <div className={styles.logisticsCard}>
            <h3 className={styles.sectionTitle}>LOGISTICS DATA</h3>
            <div className={styles.dataList}>
              <div className={styles.dataItem}>
                <span className={styles.label}>TRANSACTION ID</span>
                <span className={styles.value}>{order?.id}</span>
              </div>
              {order?.address && (
                <>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>SHIPPING DESTINATION</span>
                    <span className={styles.value}>
                      {order.address.street}<br/>
                      {order.address.city}, {order.address.zip}
                    </span>
                  </div>
                  <div className={styles.dataItem}>
                    <span className={styles.label}>DELIVERY METHOD</span>
                    <span className={styles.value}>EXPRESS TECHNICAL FREIGHT</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <button className={styles.supportLink} onClick={() => navigate('/support')}>
            <div>
              <p className={styles.supportLabel}>SUPPORT</p>
              <p className={styles.supportTitle}>ENCOUNTERED AN ISSUE?</p>
            </div>
            <span className={styles.arrow}>&nearr;</span>
          </button>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <h3 className={styles.sectionTitle}>ORDER SUMMARY</h3>
            <div className={styles.itemList}>
              {order?.items?.map((item: any, i: number) => (
                <div key={i} className={styles.item}>
                  <span className={styles.itemName}>{item.product.name} x {item.quantity}</span>
                  <span className={styles.itemPrice}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>TOTAL PAYABLE</span>
                <span className={styles.totalValue}>${order?.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <Button variant="outline" className={styles.actionBtn} onClick={() => navigate('/')}>
              CONTINUE SHOPPING
            </Button>
            <Button variant="primary" className={styles.actionBtn} onClick={() => navigate('/profile')}>
              VIEW ARCHIVE
            </Button>
          </div>
        </div>
      </div>

      <section className={styles.ethosSection}>
        <div className={styles.ethosGrid}>
          <div className={styles.ethosTitleCol}>
            <h2 className={styles.ethosTitle}>THE HYPVZN ETHOS</h2>
          </div>
          <div className={styles.ethosContentCol}>
            <p className={styles.ethosQuote}>"WE DO NOT MANUFACTURE GARMENTS. WE ENGINEER SHIELDS FOR THE MODERN ARCHITECTURE OF THE CITY."</p>
            <ul className={styles.ethosList}>
              <li>
                <span className={styles.num}>01</span>
                <span>PRECISION ARCHITECTURE: EVERY SEAM IS CALCULATED FOR MAXIMUM MOBILITY.</span>
              </li>
              <li>
                <span className={styles.num}>02</span>
                <span>CIRCULAR TECHNICALITY: TEXTILES SOURCED FROM RECLAIMED INDUSTRIAL SYNTHETICS.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Success;
