// App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './component/Navbar';
import ProductList from './component/ProductList';
import Login from './component/Login'; // Import component Login

const Homepage = () => {
  return (
       
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <h2>Newest products</h2>
          <div className="search-bar mb-3">
            <label htmlFor="search">Search</label>
            <input type="search" id="search" name="search" className="form-control d-inline-block" style={{ width: 'auto' }} />
            <button type="submit" className="btn btn-primary">Search</button>
            <ProductList/>
          </div>
          {/* <ProductList/> */}
        </div>
      </div>
    
  );
};

export default Homepage;
