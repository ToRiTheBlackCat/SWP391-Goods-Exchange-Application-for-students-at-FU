import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import Category from '../components/Category';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  const [setSelectedPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPage(page);
  };

  return (
    <div>
      <Navbar />
      <Category/>
      <div className="container mt-4">
      <h2 className={styles.heading}>Product</h2>
        <ProductList currentPage={currentPage}/>
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default HomePage;