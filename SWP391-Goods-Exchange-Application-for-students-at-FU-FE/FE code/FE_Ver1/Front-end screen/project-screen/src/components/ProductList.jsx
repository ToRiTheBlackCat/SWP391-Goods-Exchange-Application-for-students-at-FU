import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.css';
import { useLocation } from 'react-router-dom';

const ProductList = ({ currentPage, sortOrder, searchTerm, categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const term = searchTerm || searchParams.get('search') || '';
  const category = categoryId || searchParams.get('categoryId') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      let sortOrderParam;
      switch (sortOrder) {
        case 'name_asc':
          sortOrderParam = 'Name';
          break;
        case 'name_desc':
          sortOrderParam = 'name_desc';
          break;
        case 'price_asc':
          sortOrderParam = 'Price';
          break;
        case 'price_desc':
          sortOrderParam = 'price_desc';
          break;
        default:
          sortOrderParam = 'Name';
      }

      try {
        const response = await axios.get(`https://localhost:7027/api/Product/GetSorted?sortOder=${sortOrderParam}&pageIndex=${currentPage}&sortString=${term}&cateId=${category}`);
        const productData = response.data.foundList;

        const productPromises = productData.map(async (product) => {
          try {
            const imageResponse = await axios.get(`https://localhost:7027/api/Product/GetUserImage?imageName=${product.productImage}`, {
              responseType: 'text',
            });

            const fileExtension = product.productImage.split('.').pop().toLowerCase();
            const mimeType = getMimeType(fileExtension);

            const imgSrc = `data:${mimeType};base64,${imageResponse.data}`;
            return {
              imgSrc,
              alt: product.productName,
              title: product.productName,
              link: `/product/${product.productId}`,
              condition: product.productDescription,
              price: `${product.productPrice} VND`,
              seller: product.productOwner.userName,
              rating: product.productOwner.averageScore || 0,
            };
          } catch (imageError) {
            console.error('Error fetching image for product:', product.productId, imageError);
            return createFallbackProduct(product);
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter(product => product));
      } catch (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortOrder, term, category]);

  const getMimeType = (fileExtension) => {
    switch (fileExtension) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  };

  const createFallbackProduct = (product) => ({
    imgSrc: '',
    alt: product.productName,
    title: product.productName,
    link: `/product/${product.productId}`,
    condition: product.productDescription,
    price: `${product.productPrice} VND`,
    seller: 'Unknown',
    rating: 0,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.row}>
      {products.map((product, index) => (
        <div className={`col-md-4 ${styles.colMd4}`} key={index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
