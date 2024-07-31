import { useState } from 'react';
import OwnedProductsList from '../components/IncomingExchange/OwnedProductList';
import ExchangeRequests from '../components/IncomingExchange/ExchangeRequest';
import Navbar from '../components/Navbar';

const UserProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState({ id: null, name: '' }); // state lưu trữ sản phảm được chọn

  const handleSelectProduct = (productId, productName) => { //được gọi khi người dùng chọn sản phẩm 
    setSelectedProduct({ id: productId, name: productName }); //cập nhật selectedProduct khi người dùng chọn 1 sản phẩm từ danh sách
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
