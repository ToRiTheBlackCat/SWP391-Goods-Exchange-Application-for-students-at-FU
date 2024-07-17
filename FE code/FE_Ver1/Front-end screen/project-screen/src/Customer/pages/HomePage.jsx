import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/HomePage/Footer';
import ProductList from '../components/HomePage/ProductList';
import Category from '../components/HomePage/Category';
import Filter from '../components/HomePage/Filter';
import styles from '../styles/HomePage.module.css';
import axiosInstance from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const categoryId = selectedCategoryId || '';

  useEffect(() => {
    const controller = new AbortController();
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
          signal: controller.signal,
        });

        let productData = response.data.foundList;

        if (!sortOrder) {
          productData = productData.sort(() => Math.random() - 0.5);
        }

        setProducts(productData);
        setTotalPages(response.data.pageSize);
        setTotalPages(response.data.pageSize);
      } catch (error) {
        if (axiosInstance.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching products:', error);
          toast.error('Error fetching products. Please try again.');
        }
      }
    };

    fetchProducts();
    return () => {
      controller.abort();
    };
  }, [currentPage, sortOrder, term, searchSubmitted, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleDeleteSort = () => {
    setSortOrder('');
    setSortOrder('');
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      navigate(`/?`);
    } else {
      setSelectedCategoryId(categoryId);
      navigate(`/?categoryId=${categoryId}`);
    }
  };


  const handleReset = () => {
    setSearchTerm('');
    setSortOrder('');
    setSelectedCategoryId(null);
    setCurrentPage(1);
    setSearchSubmitted(false);
    setSearchSubmitted(false);
    navigate('/');
  };


  const handleSearchSubmit = () => {
    setSearchSubmitted(true);
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <div>
      <Navbar onHomeClick={handleReset} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchSubmit={handleSearchSubmit} />
      <ToastContainer />
      <Category onCategorySelect={handleCategorySelect} selectedCategoryId={selectedCategoryId} />
      <Filter onSortChange={handleSortChange} onDeleteSort={handleDeleteSort} sortOrder={sortOrder} />
      <div className="container mt-4">
        <h2 className={styles.heading}>Products</h2>
        <ProductList
          currentPage={currentPage}
          sortOrder={sortOrder}
          searchTerm={searchTerm}
          categoryId={categoryId}
          setTotalPages={setTotalPages}
          searchSubmitted={searchSubmitted}
        />
        <Footer
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HomePage;

