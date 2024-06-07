
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;