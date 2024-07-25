import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import WaitingProductList from '../components/WaitingProductList';
import WaitingProductDetail from '../components/WaitingProductDetail';
import styles from '../styles/WaitingProduct.module.css';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleProductRemove = (productId) => {
    setProducts(products.filter(product => product.productId !== productId));
    setSelectedProduct(null);
  };

  if (loading) {
    return <div className={`container ${styles.container}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`container ${styles.container}`}>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className={`container ${styles.container}`}>
        <div className="row">
          <WaitingProductList products={products} onSelectProduct={setSelectedProduct} />
          <WaitingProductDetail product={selectedProduct} onProductRemove={handleProductRemove} />
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default ViewWaitingProduct;
