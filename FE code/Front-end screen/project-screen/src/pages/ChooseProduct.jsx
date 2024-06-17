import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import ProductDetails from '../components/ProductDetails';
import styles from '../styles/ChooseProduct.module.css';
// import picture from './ảnh/unnamed.webp';

const initialProducts = [
  { name: 'Laptop MSI', price: '13.500.000 vnd', description: 'Used for 2 months', image: 'picture' },
  { name: 'Laptop Dell', price: '15.000.000 vnd', description: 'Used for 1 year', image: 'ảnh/dell.jpg' },
  { name: 'Chuột Logitech', price: '500.000 vnd', description: 'Used for 3 months', image: 'ảnh/logitech.jpg' },
  { name: 'USB Tenda', price: '200.000 vnd', description: 'Brand new', image: 'ảnh/tenda.jpg' },
  { name: 'Tai nghe Sony', price: '1.200.000 vnd', description: 'Used for 6 months', image: 'ảnh/sony.jpg' }
];

function ChooseProduct() {
  const [selectedProduct, setSelectedProduct] = useState(initialProducts[0]);

  useEffect(() => {
    setSelectedProduct(initialProducts[0]);
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className={`col-md-3 ${styles.sidebar}`}>
          <h3>Your products</h3>
          <Sidebar products={initialProducts} setSelectedProduct={setSelectedProduct} />
        </div>
        <div className={`col-md-9 ${styles['product-details']} d-flex flex-column align-items-center justify-content-center`}>
          <ProductDetails product={selectedProduct} />
        </div>
      </div>
    </div>
  );
}

export default ChooseProduct;
