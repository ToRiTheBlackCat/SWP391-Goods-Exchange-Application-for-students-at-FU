import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/HomePage/Footer'; // Ensure import Footer
import ProductList from '../components/HomePage/ProductList';
import Category from '../components/HomePage/Category';
import Filter from '../components/HomePage/Filter';
import styles from '../styles/HomePage.module.css';
import axiosInstance from '../../utils/axiosInstance';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const term = searchTerm || searchParams.get('search') || '';
  const categoryId = selectedCategoryId || searchParams.get('categoryId') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      let sortOrderParam = '';
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
            cateId: categoryId,
          },
        });

        let productData = response.data.foundList;

        if (!sortOrder) {
          productData = productData.sort(() => Math.random() - 0.5);
        }

        setProducts(productData);
        setTotalPages(response.data.pageSize);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, sortOrder, term, searchSubmitted, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleDeleteSort = () => {
    setSortOrder('');
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset to page 1
    navigate(`/?categoryId=${categoryId}`); // Update URL
  };

  const handleReset = () => {
    setSearchTerm('');
    setSortOrder('');
    setSelectedCategoryId(null);
    setCurrentPage(1);
    setSearchSubmitted(false);
    navigate('/');
  };

  const handleSearchSubmit = () => {
    setSearchSubmitted(true);
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <div className={styles.container}>
      <Navbar
        onHomeClick={handleReset}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      <Category
        onCategorySelect={handleCategorySelect}
        selectedCategoryId={selectedCategoryId}
        onSortChange={handleSortChange}
      />
      <Filter
        onSortChange={handleSortChange}
        onDeleteSort={handleDeleteSort}
        sortOrder={sortOrder}
      />
      <div className={`container mt-4 ${styles.productListWrapper}`}>
        <h2 className={styles.heading}>Products</h2>
        <ProductList products={products} />
      </div>
      <div className={styles.pagingWrapper}>
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default HomePage;
