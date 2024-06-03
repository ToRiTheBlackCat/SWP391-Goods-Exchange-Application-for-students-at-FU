
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/signup.jsx';
import Category from './pages/Category.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path='/category' element={<Category/>}/>
      </Routes>
    </Router>
  );
};


export default App 