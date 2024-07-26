import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/HomePage/Footer'; // Ensure import Footer
import ProductList from '../components/HomePage/ProductList';
import Category from '../components/HomePage/Category';
import Filter from '../components/HomePage/Filter';
import styles from '../styles/HomePage.module.css';
import Paging from '../components/HomePage/Paging';
import axiosInstance from '../../utils/axiosInstance';

import { toast } from 'react-toastify';
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
  const term = searchParams.get('search') || '';
  const categoryId = selectedCategoryId || searchParams.get('categoryId') || '';
  
  useEffect(() => {
    if (!searchSubmitted) return;

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
      } catch (error) {
        if (axiosInstance.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching products:', error);
          toast.error('Error fetching products. Please try again.');
        }
      } finally {
        setSearchSubmitted(false); // Đặt lại searchSubmitted về false sau khi thực hiện tìm kiếm
      }
    };

    fetchProducts();
    return () => {
      controller.abort();
    };
  }, [searchSubmitted]);

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
  }, [currentPage, sortOrder, categoryId]);

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
    navigate('/');
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchSubmitted(true);
    navigate(`/?search=${searchTerm}`);
  };

  const categories = [
    "All Products",
    "Electroics",
    "Accessories",
    "Houseware",
    "Books",
    "School supplies",
    "Clothes",
  ];
  
  function FilterMenuLeft() {
    return (
      <ul className="list-group list-group-flush rounded">
        <li className="list-group-item d-none d-lg-block">
          <h5 className="mt-1 mb-2">Category</h5>
          <div className="d-flex flex-wrap my-2">
            {categories.map((v, i) => {
              return (
                <Link
                  key={i}
                  to="/products"
                  className="btn btn-sm btn-outline-dark rounded-pill me-2 mb-2"
                  replace
                >
                  {v}
                </Link>
              );
            })}
          </div>
        </li>
        <li className="list-group-item">
          <h5 className="mt-1 mb-2">Price Range</h5>
          <div className="d-grid d-block mb-3">
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Min"
                defaultValue="100000"
              />
              <label htmlFor="floatingInput">Min Price</label>
            </div>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Max"
                defaultValue="500000"
              />
              <label htmlFor="floatingInput">Max Price</label>
            </div>
            <button className="btn btn-dark">Apply</button>
          </div>
        </li>
      </ul>
    );
  }

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
      
      <div className='row mb-4 mt-lg-3'>
        <div className='d-none d-lg-block col-lg-3'>
          <FilterMenuLeft/>
        </div>
        <div className='d-none d-lg-block col-lg-9'>
          <div className={`container mt-4 ${styles.productListWrapper}`}>
            <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex justify-content-between" style={{ marginLeft: '14px', width: '100%' }}>
              
              <Filter
                onSortChange={handleSortChange}
                onDeleteSort={handleDeleteSort}
                sortOrder={sortOrder}
              />
              
              <div className="input-group" style={{width: '370px'}}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search products..."
                  aria-label="search input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-dark" onClick={handleSearchSubmit}>
                  Search
                </button>
              </div>
            </div>
            <h2 className={styles.heading}>Products</h2>
            <ProductList
              currentPage={currentPage}
              sortOrder={sortOrder}
              searchTerm={term} // Sử dụng `term` thay vì `searchTerm` để lấy từ URL
              categoryId={categoryId}
              setTotalPages={setTotalPages}
              searchSubmitted={searchSubmitted}
            />
          </div>
        </div>
      </div>
      <div className={styles.pagingWrapper}>
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      <Paging/>
    </div>
  );
};

export default HomePage;
