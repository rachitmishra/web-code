import React from 'react';
import ProductCard from '../../../components/ui/ProductCard/ProductCard';
import styles from './RelatedProductsPlugin.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface RelatedProductsPluginProps {
  relatedProducts: Product[];
  onProductClick: (id: string) => void;
  onAddToCart: (product: any) => void;
}

const RelatedProductsPlugin: React.FC<RelatedProductsPluginProps> = ({
  relatedProducts,
  onProductClick,
  onAddToCart
}) => {
  if (relatedProducts.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Related Products</h2>
      <div className={styles.grid}>
        {relatedProducts.map(p => (
          <ProductCard 
            key={p.id} 
            product={p as any} 
            onClick={(id) => onProductClick(id)}
            onAddToCart={(p) => onAddToCart(p)}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProductsPlugin;
