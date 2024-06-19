import { useState } from 'react';
import OwnedProductsList from '../components/OwnedProductList';
import ExchangeRequests from '../components/ExchangeRequest';
import Navbar from '../components/Navbar';

const UserProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState({ id: null, name: '' });

  const handleSelectProduct = (productId, productName) => {
    setSelectedProduct({ id: productId, name: productName });
  };

  return (
    <div>
      <Navbar />
      <OwnedProductsList onSelectProduct={handleSelectProduct} />
      {selectedProduct.id && (
        <ExchangeRequests productId={selectedProduct.id} productName={selectedProduct.name} />
      )}
    </div>
  );
};

export default UserProductsPage;
