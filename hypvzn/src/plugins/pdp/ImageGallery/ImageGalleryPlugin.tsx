import React from 'react';
import styles from './ImageGalleryPlugin.module.css';

interface ImageGalleryPluginProps {
  product: {
    image?: string;
    name: string;
  };
}

const ImageGalleryPlugin: React.FC<ImageGalleryPluginProps> = ({ product }) => {
  return (
    <div className={styles.gallery}>
      {product.image ? (
        <img src={product.image} alt={product.name} className={styles.mainImage} />
      ) : (
        <div className={styles.placeholder}>
          No Image
        </div>
      )}
    </div>
  );
};

export default ImageGalleryPlugin;
