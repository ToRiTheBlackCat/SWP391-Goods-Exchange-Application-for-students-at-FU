// App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Signup from './component/signup';
import Login from './component/Login'; // Import component Login
import Homepg from './Homepage';
import Category from './component/Category';
const App = () => {
  return (
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" element={<Homepg />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/category" element={<Category/>}/>

          </Routes>
        </div>
    </Router>
  );
};

export default App;
