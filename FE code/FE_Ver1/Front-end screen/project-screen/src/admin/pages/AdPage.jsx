import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/AdPage/Footer';
import AdProductList from '../components/AdPage/AdProductList';
// import Category from '../components/AdPage/Category';
import Filter from '../components/AdPage/Filter';
import styles from '../styles/AdPage.module.css';
import axiosInstance from '../../utils/axiosInstance';

import electronic from '../assets/electronics.jpg';
import accessories from '../assets/accessories.jpg';
import houseware from '../assets/houseware.jpg';
import books from '../assets/books.jpg';
import school_supplies from '../assets/school_supplies.jpg';
import clothes from '../assets/clothes.jpg';

const AdPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [sortOrder, setSortOrder] = useState(''); // Default sort order
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(true); // Track search submission
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const term = searchTerm || searchParams.get('search') || '';

  useEffect(() => {
    if (!searchSubmitted) return;

    const fetchProducts = async () => {
      if (!searchSubmitted) return; // Prevent fetching products if search is not submitted

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
            searchString: term,
            cateId: selectedCategoryId,
            fromPrice: minPrice,
            toPrice: maxPrice,
          },
        });

        setTotalPages(response.data.pageSize); // Assuming the API returns the total number of pages
        setSearchSubmitted(false); // Reset searchSubmitted after fetching products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [currentPage, sortOrder, term, searchSubmitted, selectedCategoryId, minPrice, maxPrice]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchSubmitted(true);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
    setSearchSubmitted(true);
  };

  const handleDeleteSort = () => {
    setSortOrder(''); // Reset sort order to default
    setSearchSubmitted(true);
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 0) {
      setSelectedCategoryId(null); // Set to null for "All Products"
      navigate(`/ad/?`);
    }
    else if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      navigate(`/ad/?`); // Reset category filter
    } else {
      setSelectedCategoryId(categoryId);
      navigate(`/ad/?categoryId=${categoryId}`);
    }
    setSearchSubmitted(true);
  };
  const handleReset = () => {
    setSearchTerm('');
    setSortOrder('');
    setSelectedCategoryId(null);
    setCurrentPage(1);
    setSearchSubmitted(false);
    setMaxPrice(0);
    setMinPrice(0); // Reset search submission
    navigate('/');
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchSubmitted(true);
    navigate(`/ad/?search=${searchTerm}`);
  };
  const handlePriceApply = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (minPriceRef.current && maxPriceRef.current) {
      setMinPrice(minPriceRef.current.value);
      setMaxPrice(maxPriceRef.current.value);
    }
    setSearchSubmitted(true); // Trigger useEffect to fetch products
  };
  const categories = [
    { name: "All Products" },
    { name: "Electronics", imgSrc: electronic },
    { name: "Accessories", imgSrc: accessories },
    { name: "Houseware", imgSrc: houseware },
    { name: "Books", imgSrc: books },
    { name: "School supplies", imgSrc: school_supplies },
    { name: "Clothes", imgSrc: clothes },
  ];

  function FilterMenuLeft() {
    return (
      <ul className="list-group list-group-flush rounded">
        <li className="list-group-item d-none d-lg-block">
          <h5 className="mt-1 mb-2">Category</h5>
          <div className="d-flex flex-wrap my-2">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="#"
                className={`btn btn-sm btn-outline-dark rounded-pill me-2 mb-2 ${selectedCategoryId === index ? styles.selectedCategory : ''}`} style={{width:'400px', height:'60px', position:'relative', justifyContent: 'space-between',alignItems: 'center' }}
                onClick={() => handleCategorySelect(index)}
              >
                <div style={{alignContent:'left', position:'absolute'}}>
                  {category.imgSrc && <img src={category.imgSrc} alt={category.name} className={styles.categoryIcon} />}
                </div>
                <div style={{position: 'absolute', width: '100%',height: '100%',display: 'flex',justifyContent: 'center',textAlign: 'center',paddingBottom: '7px', alignItems: 'center'}}>
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </li>
        <li className="list-group-item">
          <h5 className="mt-1 mb-2">Price Range</h5>
          <form onSubmit={handlePriceApply}>
            <div className="d-grid d-block mb-3">
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Min"
                  ref={minPriceRef}
                />
                <label htmlFor="floatingInput">Min Price</label>
              </div>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Max"
                  ref={maxPriceRef}
                />
                <label htmlFor="floatingInput">Max Price</label>
              </div>
              <button type="submit" className="btn btn-dark">Apply</button>
            </div>
          </form>
        </li>
      </ul>
    );
  }

  return (
    <div>
      <Navbar  onHomeClick={handleReset} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchSubmit={handleSearchSubmit}/>
      {/* <Category onCategorySelect={handleCategorySelect} selectedCategoryId={selectedCategoryId} /> */}
      <div className='row mb-4 mt-lg-3' style={{margin: '0px 30px'}}>
        <div className='d-none d-lg-block col-lg-3'>
          <FilterMenuLeft />
        </div>
        <div className='d-none d-lg-block col-lg-9' style={{ padding: '0px 0px' }}>
          <div className={`container mt-4 ${styles.productListWrapper}`} style={{ paddingLeft: '-14px' }}>
          <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex justify-content-between" style={{ marginLeft: '0px', width: '100%' }}>
              <Filter
                onSortChange={handleSortChange}
                onDeleteSort={handleDeleteSort}
                sortOrder={sortOrder}
              />

              <div className="input-group" style={{ width: '370px' }}>
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
      <div className="container mt-4">
        <h2 className={styles.heading}>Products</h2>
        <AdProductList currentPage={currentPage} sortOrder={sortOrder} searchTerm={searchTerm} categoryId={selectedCategoryId} setTotalPages={setTotalPages}
          searchSubmitted={searchSubmitted} // Pass search submission state to ProductList
          minPrice={minPrice}
          maxPrice={maxPrice} />
        </div>
        </div>
      </div>
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default AdPage;
