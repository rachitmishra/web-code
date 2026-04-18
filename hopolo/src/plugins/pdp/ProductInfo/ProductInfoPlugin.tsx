import React from 'react';
import Button from '../../../components/ui/Button/Button';
import QuantitySelector from '../../../components/ui/QuantitySelector/QuantitySelector';
import styles from './ProductInfoPlugin.module.css';

interface ProductInfoPluginProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    priceDisclaimer?: string;
    rating?: number;
    deliveryTime?: string;
    specifications?: Record<string, string>;
    artDetails?: Record<string, string>;
    sizes?: string[];
    colors?: string[];
  };
  quantity: number;
  setQuantity: (q: number) => void;
  selectedSize?: string;
  setSelectedSize?: (s: string) => void;
  selectedColor?: string;
  setSelectedColor?: (c: string) => void;
  onAddToCart: () => void;
  adding?: boolean;
}

const ProductInfoPlugin: React.FC<ProductInfoPluginProps> = ({
  product,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  onAddToCart,
  adding
}) => {
  return (
    <div className={styles.details}>
      <h1 className={styles.name}>{product.name}</h1>
      <div className={styles.price}>
        ${product.price.toFixed(2)}
        {product.priceDisclaimer && (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
            {product.priceDisclaimer}
          </span>
        )}
      </div>
      {product.rating && <div className={styles.rating}>⭐ {product.rating} / 5.0</div>}
      
      {product.deliveryTime && (
        <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500 }}>
          Estimated Delivery: {product.deliveryTime}
        </div>
      )}

      <p className={styles.description}>
        {product.description || `This is a beautiful ${product.name}. Minimalist design with playful accents, perfect for your collection.`}
      </p>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className={styles.infoSection}>
          <strong>Specifications</strong>
          <div className={styles.infoGrid}>
            {Object.entries(product.specifications).map(([key, value]) => (
              <React.Fragment key={key}>
                <span className={styles.infoKey}>{key}</span>
                <span className={styles.infoValue}>{value}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {product.artDetails && Object.keys(product.artDetails).length > 0 && (
        <div className={styles.infoSection}>
          <strong>Art Details</strong>
          <div className={styles.infoGrid}>
            {Object.entries(product.artDetails).map(([key, value]) => (
              <React.Fragment key={key}>
                <span className={styles.infoKey}>{key}</span>
                <span className={styles.infoValue}>{value}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && setSelectedSize && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <strong>Size</strong>
          <div style={{ display: 'flex', gap: '8px' }}>
            {product.sizes.map(size => (
              <button
                key={size}
                className={`${styles.ratingBtn} ${selectedSize === size ? styles.activeRating : ''}`}
                onClick={() => setSelectedSize(size)}
                style={{ minWidth: '40px', textAlign: 'center' }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors && product.colors.length > 0 && setSelectedColor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <strong>Color</strong>
          <div style={{ display: 'flex', gap: '8px' }}>
            {product.colors.map(color => (
              <button
                key={color}
                className={`${styles.ratingBtn} ${selectedColor === color ? styles.activeRating : ''}`}
                onClick={() => setSelectedColor(color)}
                style={{ padding: '8px 16px' }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <div className={styles.addToCartRow}>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
          <Button 
            className={styles.addToCartButton}
            onClick={onAddToCart}
            loading={adding}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPlugin;
