import React, { useMemo } from 'react';
import CategoryTabs from '../../../components/ui/CategoryTabs/CategoryTabs';
import ProductCard from '../../../components/ui/ProductCard/ProductCard';
import { useHomeContext } from '../../../pages/Home/Context';
import styles from './ProductGridSectionPlugin.module.css';

const ProductGridSectionPlugin: React.FC = () => {
  const { products, categories, actions, state } = useHomeContext();
  const { activeCategoryId, isGridChanging } = state;

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === "all") return products;
    return products.filter((p) => p.category === activeCategoryId);
  }, [products, activeCategoryId]);

  return (
    <section className={styles.section}>
      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={actions.handleCategoryChange}
      />

      <div className={`${styles.grid} ${isGridChanging ? styles.gridChanging : ''}`}>
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={styles.productCardEntry} 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard
              product={product}
              onAddToCart={actions.handleAddToCart}
              onClick={(id) => actions.navigate(`/product/${id}`)}
            />
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className={styles.noProducts}>
          No products found in this category.
        </div>
      )}
    </section>
  );
};

export default ProductGridSectionPlugin;
