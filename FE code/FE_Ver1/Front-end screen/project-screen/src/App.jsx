
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/signup.jsx';
import GetOTP from './pages/GetOTP.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import ProductPage from './pages/ProductPage.jsx'
import ChooseProduct from './pages/ChooseProduct.jsx';
import UserInformation from './pages/UserInformation.jsx';
import Exchange from './pages/Exchange.jsx';
import ExchangeList from './pages/ExchangeList.jsx';
import UserProductsPage from './pages/UserProductPage.jsx';
import store from './store/store.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path='/forgot-password' element={<GetOTP/>}/>
        <Route path='/create-product' element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path='/choose-product' element={<ChooseProduct/>}/>
        <Route path='/profile' element={<UserInformation/>}/>
        <Route path='/exchange' element={<Exchange/>}/>
        <Route path='/exchange-list' element={<ExchangeList/>}/>
        <Route path='/product'element={<UserProductsPage/>}/>
      </Routes>
    </Router>
    </Provider>
  );
};


export default App 