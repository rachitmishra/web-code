import React from 'react';
import FeaturedCollection from '../../../components/ui/FeaturedCollection/FeaturedCollection';
import { useHomeContext } from '../../../pages/Home/Context';

const FeaturedCollectionPlugin: React.FC = () => {
  const { products, actions } = useHomeContext();

  return (
    <FeaturedCollection
      products={products}
      onAddToCart={actions.handleAddToCart}
    />
  );
};

export default FeaturedCollectionPlugin;
