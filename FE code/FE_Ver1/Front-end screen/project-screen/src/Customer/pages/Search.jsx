import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import styles from '../styles/Search.module.css';
import Filter from '../components/Filter';

const Search = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('name_asc'); // Default sort order
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    // Reset the current page to 1 when the search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filteredProducts) => {
    setProducts(filteredProducts);
  };

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <div>
      <Navbar />
      <Filter onSortChange={handleSortChange} />
      <div className="container mt-4">
        <h2 className={styles.heading}>Search Results for "{searchTerm}"</h2>
        <ProductList 
          currentPage={currentPage} 
          products={products} 
          sortOrder={sortOrder} 
          searchTerm={searchTerm} // Pass searchTerm to ProductList
        />
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Search;
