import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard.jsx';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5152/api/Products');
        console.log('API response:', response.data); // Kiểm tra dữ liệu từ API
        const mappedProducts = response.data.map(product => ({
          imgSrc: product.productImage, // Sử dụng đúng thuộc tính từ dữ liệu API
          alt: product.productName,
          title: product.productName,
          // link: `/product/${product.id}`, // Giả sử có thuộc tính id, bạn có thể điều chỉnh nếu cần thiết
          condition: product.productDescription, // Sử dụng mô tả sản phẩm như điều kiện
          // color: 'Not specified', // Bạn có thể bỏ qua nếu không cần
          // size: 'Not specified', // Bạn có thể bỏ qua nếu không cần
          price: `${product.productPrice} VND`, // Giá sản phẩm
          // seller: 'Unknown', // Điều chỉnh nếu có thông tin người bán
          // rating: 0 // Giả sử mặc định, điều chỉnh nếu có thông tin đánh giá
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products.');
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="row">
      {products.map((product, index) => (
        <div className="col-md-4" key={index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default ProductList;
