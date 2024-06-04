
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/signup.jsx';
import Category from './pages/Category.jsx';
import GetOTP from './pages/GetOTP.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path='/category' element={<Category/>}/>
        <Route path='/forgot-password' element={<GetOTP/>}/>
        <Route path='/create-product' element={<CreateProduct/>}/>
      </Routes>
    </Router>
  );
};


export default App 