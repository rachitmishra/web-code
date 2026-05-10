import React from 'react';
import Card from '../Card/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  growth?: number;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, growth, suffix }) => {
  const isPositive = growth && growth > 0;
  const isNegative = growth && growth < 0;
  const isNeutral = growth === 0;

  return (
    <Card className={styles.card}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {value}{suffix}
      </div>
      {growth !== undefined && (
        <div className={`${styles.growth} ${isPositive ? styles.positive : ''} ${isNegative ? styles.negative : ''}`}>
          <span className={styles.growthIcon}>
            {isPositive && <TrendingUp size={14} />}
            {isNegative && <TrendingDown size={14} />}
            {isNeutral && <Minus size={14} />}
          </span>
          <span className={styles.growthValue}>
            {Math.abs(growth).toFixed(1)}%
          </span>
          <span className={styles.growthPeriod}>vs last period</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
