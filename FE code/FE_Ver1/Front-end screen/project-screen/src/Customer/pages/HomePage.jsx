import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/HomePage/Footer';
import ProductList from '../components/HomePage/ProductList';
import Category from '../components/HomePage/Category';
import Filter from '../components/HomePage/Filter';
import styles from '../styles/HomePage.module.css';
import axios from 'axios';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('name_asc'); // Default sort order
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';

  useEffect(() => {
    const fetchProducts = async () => {
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
        const response = await axios.get(`https://localhost:7027/api/Product/GetSorted?sortOder=${sortOrderParam}&pageIndex=${currentPage}&sortString=${searchTerm}&cateId=${categoryId}`);
        const productData = response.data.foundList;
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, sortOrder, searchTerm, categoryId])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleFilterChange = (filteredProducts) => {
    setProducts(filteredProducts);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/?categoryId=${categoryId}`);
  };

  return (
    <div>
      <Navbar />
      <Category 
        onCategorySelect={handleCategorySelect} 
        selectedCategoryId={parseInt(categoryId, 10)} 
      />
      <Filter onSortChange={handleSortChange} />
      <div className="container mt-4">
      <h2 className={styles.heading}>Product</h2>
        <ProductList currentPage={currentPage} sortOrder={sortOrder} searchTerm={searchTerm} categoryId={categoryId} />
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default HomePage;