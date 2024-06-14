import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListProduct from '../components/ListProduct';
import ProductInfo from '../components/ProductInfo';
import Navbar from '../components/Navbar';
import styles from '../styles/ChooseProduct.module.css';
import axiosInstance from '../authorized/axiosInstance';

function ChooseProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axiosInstance.get(`/api/Product/Student/ViewOwnProductList/${userId}`)
        .then(response => {
          const fetchedProducts = response.data.map(product => ({
            id: product.productId,
            name: product.productName,
            image: product.productImage,
            description: product.productDescription,
            price: `${product.productPrice} vnd`,
          }));
          setProducts(fetchedProducts);
          if (fetchedProducts.length > 0) {
            setSelectedProduct(fetchedProducts[0]);
          }
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, []);

  return (
    <div className="container-fluid">
    <Navbar/>
      <div className="row">
        <div className={`col-md-3 ${styles.sidebar}`}>
          <h3>Your products</h3>
          <ListProduct products={products} setSelectedProduct={setSelectedProduct} />
        </div>
        <div className={`col-md-9 ${styles['product-details']} d-flex flex-column align-items-center justify-content-center`}>
          {selectedProduct && <ProductInfo product={selectedProduct} />}
        </div>
      </div>
    </div>
  );
}

export default ChooseProduct;