import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedProduct } from '../store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListProduct from '../components/ChooseProduct/ListProduct';
import ProductInfo from '../components/ChooseProduct/ProductInfo';
import Navbar from '../components/Navbar';
import styles from '../styles/ChooseProduct.module.css';
import axiosInstance from '../../utils/axiosInstance';

function ChooseProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProductLocal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axiosInstance.get(`/api/Product/Student/ViewOwnAvailableProductList/${userId}`)
        .then(response => {
          const fetchedProducts = response.data.map(product => ({
            id: product.productId,
            name: product.productName,
            image: product.productImage,
            description: product.productDescription,
            price: product.productPrice ,
            status: product.status
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
  const handleSelectClick = (product) => {
    dispatch(setSelectedProduct(product));
    console.log('Selected product', product);
    navigate('/exchange');
  };

  return (
    <div className="container-fluid" style={{padding:'0px'}}>
    <Navbar/>
      <div className="row">
        <div className={`col-md-3 ${styles.sidebar}`}>
          <h3>Your products</h3>
          <ListProduct products={products} setSelectedProduct={setSelectedProductLocal} />
        </div>
        <div className={`col-md-9 ${styles['product-details']} d-flex flex-column align-items-center justify-content-center`}>
          {selectedProduct && <ProductInfo product={selectedProduct} onSelect={handleSelectClick}/>}
        </div>
      </div>
    </div>
  );
}

export default ChooseProduct;