import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/SignUp.jsx';
import Category from './pages/Category.jsx';
import GetOTP from './pages/GetOTP.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ChooseProduct from './pages/ChooseProduct.jsx';
import UserInformation from './pages/UserInformation.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category" element={<Category />} />
        <Route path="/forgot-password" element={<GetOTP />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/choose-product" element={<ChooseProduct />} />
        <Route path="/profile" element={<UserInformation />} />
      </Routes>
    </Router>
  );
};

export default App;
