import React from 'react';
import BestSellers from '../../../components/ui/BestSellers/BestSellers';
import { useHomeContext } from '../../../pages/Home/Context';

const BestSellersPlugin: React.FC = () => {
  const { bestSellers, actions } = useHomeContext();

  return (
    <BestSellers
      products={bestSellers}
      onAddToCart={actions.handleAddToCart}
    />
  );
};

export default BestSellersPlugin;
