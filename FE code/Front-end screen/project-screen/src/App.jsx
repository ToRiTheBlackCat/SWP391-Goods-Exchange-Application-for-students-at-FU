
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/signup.jsx';
import Category from './pages/Category.jsx';
import GetOTP from './pages/GetOTP.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import ProductPage from './pages/ProductPage.jsx'
import ChooseProduct from './pages/ChooseProduct.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path='/category' element={<Category/>}/>
        <Route path='/forgot-password' element={<GetOTP/>}/>
        <Route path='/create-product' element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path='/choose-product' element={<ChooseProduct/>}/>
      </Routes>
    </Router>
  );
};


export default App 