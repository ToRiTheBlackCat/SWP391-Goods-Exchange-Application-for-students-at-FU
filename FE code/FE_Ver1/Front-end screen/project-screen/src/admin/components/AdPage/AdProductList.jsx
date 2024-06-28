import { useEffect, useState } from 'react';
import ProductCard from '../AdPage/AdProductCard';
import styles from '../../styles/ProductList.module.css';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../authorized/axiosInstance';

const AdProductList = ({ currentPage, sortOrder, searchTerm, categoryId, setTotalPages }) => {
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
          sortOrderParam = '';
      }
      try {
        const response = await axiosInstance.get(`/api/Product/GetSorted`, {
          params: {
            sortOrder: sortOrderParam,
            pageIndex: currentPage,
            sortString: term,
            cateId: category,
            pageSize: 6, // Define page size here
          },
        });
        const productData = response.data.foundList;

        const promises = productData.map(async (product) => {
          try {
            const imageResponse = await axiosInstance.get(`/api/Product/GetUserImage?imageName=${product.productImage}`);

            const fileExtension = product.productImage.split('.').pop().toLowerCase();
            let mimeType;
            switch (fileExtension) {
              case 'jpeg':
              case 'jpg':
                mimeType = 'image/jpeg';
                break;
              case 'png':
                mimeType = 'image/png';
                break;
              case 'webp':
                mimeType = 'image/webp';
                break;
              default:
                mimeType = 'image/jpeg';
                break;
            }

            const imgSrc = `data:${mimeType};base64,${imageResponse.data}`;
            return {
              imgSrc,
              alt: product.productName,
              title: product.productName,
              // link: `/product/${product.productId}`,
              condition: product.productDescription,
              price: `${product.productPrice.toLocaleString()} VND`,
              seller: product.productOwner.userName,
              rating: product.productOwner.averageScore || 0,
            };
          } catch (error) {
            console.error('Error fetching image for product:', product.productId, error);
            return {
              imgSrc: '',
              alt: product.productName,
              title: product.productName,
              // link: `/product/${product.productId}`,
              condition: product.productDescription,
              price: `${product.productPrice.toLocaleString()} VND`,
              seller: 'Unknown',
              rating: 0,
            };
          }
        });

        const mappedProducts = await Promise.all(promises);
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortOrder, term, category, setTotalPages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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

export default AdProductList;
