import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(5); // Total number of pages fixed to 5
  const [selectedPage, setSelectedPage] = useState(1); // State for selected page
  const productsPerPage = 6; // Number of products per page

 /* useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
       // const response = await axios.get('http://localhost:5299/api/Product/GetTotalCount');
        const totalProducts = response.data;
        setTotalPages(Math.ceil(totalProducts / productsPerPage));
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    fetchTotalProducts();
  }, [productsPerPage]);*/

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPage(page); // Update selected page
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <ProductList currentPage={currentPage}  />
        <div className="alert alert-info mt-3">
          Người dùng đã chọn trang {selectedPage}
        </div>
        <Footer currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default HomePage;
