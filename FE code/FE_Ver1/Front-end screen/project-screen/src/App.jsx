
import Login from '../src/Customer/pages/Login.jsx';
import HomePage from '../src/Customer/pages/HomePage.jsx';
import SignUp from '../src/Customer/pages/signup.jsx';
import GetOTP from '../src/Customer/pages/GetOTP.jsx';
import ChangePassword from './Customer/pages/ChangePassword.jsx';
import CreateProduct from '../src/Customer/pages/CreateProduct.jsx';
import ProductPage from '../src/Customer/pages/ProductPage.jsx'
import ChooseProduct from '../src/Customer/pages/ChooseProduct.jsx';
import UserInformation from '../src/Customer/pages/UserInformation.jsx';
import Exchange from '../src/Customer/pages/Exchange.jsx';
import ExchangeList from '../src/Customer/pages/ExchangeList.jsx';
import UserProductsPage from '../src/Customer/pages/UserProductPage.jsx';
import ViewProduct from './Customer/pages/ViewProduct.jsx';
import store from './Customer/store/store.jsx';
import UpdateProduct from './Customer/pages/UpdateProduct.jsx';
import ReportProduct from './Customer/pages/Report.jsx';

import WaitingProduct from './Mod/pages/ViewWaitingProduct.jsx';
import ModPage from './Mod/pages/ModPage.jsx';
import ModProductPage from './Mod/pages/ModProductPage.jsx';
import UserProfile from './Mod/pages/User-profile.jsx';
import ViewBanUser from './Mod/pages/ViewBanUser.jsx';

import AdPage from './admin/pages/AdPage.jsx';
import ManageExchanges from './admin/pages/ManageExchanges.jsx';
import ManageAccounts from './admin/pages/ManageAccounts.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import ReportList from './Mod/components/ReportList.jsx';

const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path='/forgot-password' element={<GetOTP/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
        <Route path='/create-product' element={<CreateProduct/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path='/choose-product' element={<ChooseProduct/>}/>
        <Route path='/profile' element={<UserInformation/>}/>
        <Route path='/exchange' element={<Exchange/>}/>
        <Route path='/exchange-list' element={<ExchangeList/>}/>
        <Route path='/product'element={<UserProductsPage/>}/>
        <Route path='/own-product' element={<ViewProduct/>}/>
        <Route path='/report' element={<ReportProduct/>}/>
        <Route path='/waiting-product' element={<WaitingProduct/>}/>
        <Route path="/mod/product/:id" element={<ModProductPage/>}/>
        <Route path='/update-product/:id' element={<UpdateProduct/>}/>
        <Route path='/report-list' element={<ReportList/>}/>
        <Route path='/ad/manage-account/:userId' element={<ManageAccounts/>}/>
        <Route path='/mod' element={<ModPage/>}/>
        <Route path='/mod/view-profile/:userId' element={<UserProfile/>}/>
        <Route path='/view-banned-user' element={<ViewBanUser/>}/>


        <Route path='/manage-account' element={<ManageAccounts/>}/>
        <Route path='/ad' element={<AdPage/>}/>
        <Route path='/manage-exchange' element={<ManageExchanges/>}/>

      </Routes>
    </Router>
    </Provider>
  );
};


export default App 