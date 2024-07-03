import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListProduct from '../components/ChooseProduct/ListProduct';
import ViewProductDetails from '../components/ViewProduct/ViewProductDetails';
import Navbar from '../components/Navbar';
import styles from '../styles/ChooseProduct.module.css';
import axiosInstance from '../../utils/axiosInstance';

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProductLocal] = useState(null);

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
            price: product.productPrice,
            status: product.status, // Add status to the product object
          }));
          setProducts(fetchedProducts);
          if (fetchedProducts.length > 0) {
            setSelectedProductLocal(fetchedProducts[0]);
          }
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, []);

  const handleDeleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    setSelectedProductLocal(null);
  };

  return (
    <div className="container-fluid"  style={{padding:'0px'}}>
      <Navbar />
      <div className="row">
        <div className={`col-md-3 ${styles.sidebar}`}>
          <h3>Your products</h3>
          <ListProduct products={products} setSelectedProduct={setSelectedProductLocal} />
        </div>
        <div className={`col-md-9 ${styles['product-details']} d-flex flex-column align-items-center justify-content-center`}>
          {selectedProduct && <ViewProductDetails product={selectedProduct} onDelete={handleDeleteProduct} />}
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;
