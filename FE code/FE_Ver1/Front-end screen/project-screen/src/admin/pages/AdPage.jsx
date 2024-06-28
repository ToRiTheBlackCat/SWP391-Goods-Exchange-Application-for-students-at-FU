import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/AdPage/Footer';
import AdProductList from '../components/AdPage/AdProductList';
import Category from '../components/AdPage/Category';
import Filter from '../components/AdPage/Filter';
import styles from '../styles/AdPage.module.css';
import axiosInstance from '../../authorized/axiosInstance';

const AdPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState(''); // Default sort order
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';
  const categoryId = selectedCategoryId || '';

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
          sortOrderParam = ''; // Default sort order
      }
      try {
        const response = await axiosInstance.get(`/api/Product/GetSorted`, {
          params: {
            sortOder: sortOrderParam,
            pageIndex: currentPage,
            sortString: searchTerm,
            cateId: categoryId,
          },
        });
        let productData = response.data.foundList;

        // Randomize the product list if sortOrder is empty
        if (!sortOrder) {
          productData = productData.sort(() => Math.random() - 0.5);
        }

        setProducts(productData);
        setTotalPages(response.data.pageSize); // Assuming the API returns the total number of pages
      } catch (error) {
        console.error('Error fetching products:', error);
      }

    };

    fetchProducts();
  }, [currentPage, sortOrder, searchTerm, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleDeleteSort = () => {
    setSortOrder(''); // Reset sort order to default
  };

  const handleCategorySelect = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      navigate(`/ad/?`); // Reset category filter
    } else {
      setSelectedCategoryId(categoryId);
      navigate(`/ad/?categoryId=${categoryId}`);
    }
  };

  return (
    <div>
      <Navbar />
      <Category onCategorySelect={handleCategorySelect} selectedCategoryId={selectedCategoryId} />
      <Filter onSortChange={handleSortChange} onDeleteSort={handleDeleteSort} sortOrder={sortOrder} />
      <div className="container mt-4">
        <h2 className={styles.heading}>Products</h2>
        <AdProductList currentPage={currentPage} sortOrder={sortOrder} searchTerm={searchTerm} categoryId={categoryId} />
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default AdPage;