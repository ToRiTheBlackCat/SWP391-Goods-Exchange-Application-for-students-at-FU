
import Login from '../src/Customer/pages/Login.jsx';
import HomePage from '../src/Customer/pages/HomePage.jsx';
import SignUp from '../src/Customer/pages/signup.jsx';
import GetOTP from '../src/Customer/pages/GetOTP.jsx';
import CreateProduct from '../src/Customer/pages/CreateProduct.jsx';
import ProductPage from '../src/Customer/pages/ProductPage.jsx'
import ChooseProduct from '../src/Customer/pages/ChooseProduct.jsx';
import UserInformation from '../src/Customer/pages/UserInformation.jsx';
import Exchange from '../src/Customer/pages/Exchange.jsx';
import ExchangeList from '../src/Customer/pages/ExchangeList.jsx';
import UserProductsPage from '../src/Customer/pages/UserProductPage.jsx';
import store from './Customer/store/store.jsx';
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