import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../../../services/productService';
import styles from './FeaturedCollection.module.css';
import { useNavigate, Link } from 'react-router';

interface FeaturedCollectionProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ products, onAddToCart }) => {
  const navigate = useNavigate();

  // For this design, we just take the first 2 products
  const displayProducts = products.slice(0, 2);

  if (displayProducts.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Collection 01</h2>
          <p className={styles.subtitle}>DEPLOYMENT_SEQUENCE: ALPHA_v1.0</p>
        </div>
        <Link to="/" className={styles.viewAll}>VIEW_ALL_01</Link>
      </div>
      <div className={styles.grid}>
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onClick={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;
