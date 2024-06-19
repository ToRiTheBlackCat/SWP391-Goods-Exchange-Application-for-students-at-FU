import { useState, useEffect } from 'react';
import axiosInstance from '../../authorized/axiosInstance';
import WaitingProductList from '../components/WaitingProductList';
import WaitingProductDetail from '../components/WaitingProductDetail';
import styles from '../styles/WaitingProduct.module.css';
import Navbar from '../../Customer/components/Navbar';

const ViewWaitingProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axiosInstance.get('/api/Product/Mod/ViewProductWaitingList');
          setProducts(response.data);
          setLoading(false);
        } catch (error) {
          setError('Error fetching products');
          setLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  
    if (loading) {
      return <div className={`container ${styles.container}`}>Loading...</div>;
    }
  
    if (error) {
      return <div className={`container ${styles.container}`}>{error}</div>;
    }
  
    return (
        <>
        <Navbar/>
        <div className={`container ${styles.container}`}>
        <div className="row">
          <WaitingProductList products={products} onSelectProduct={setSelectedProduct} />
          <WaitingProductDetail product={selectedProduct} />
        </div>
      </div>
      </>
    );
  };
  
  export default ViewWaitingProduct;
