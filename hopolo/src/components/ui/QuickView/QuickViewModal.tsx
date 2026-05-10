import React, { useState } from 'react';
import styles from './QuickViewModal.module.css';
import Button from '../Button/Button';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import { type Product } from '../../../services/productService';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? undefined : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? undefined : undefined
  );

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color.');
      return;
    }

    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img src={product.image} alt={product.name} className={styles.image} />
          </div>
          
          <div className={styles.details}>
            <h2 className={styles.name}>{product.name}</h2>
            <div className={styles.price}>${product.price.toFixed(2)}</div>
            
            <p className={styles.description}>{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionSection}>
                <span className={styles.optionLabel}>SIZE</span>
                <div className={styles.options}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`${styles.optionBtn} ${selectedSize === size ? styles.active : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionSection}>
                <span className={styles.optionLabel}>COLOR</span>
                <div className={styles.options}>
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`${styles.optionBtn} ${selectedColor === color ? styles.active : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
              <Button 
                variant="primary" 
                onClick={handleAddToCart}
                className={styles.addBtn}
              >
                ADD_TO_BAG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
