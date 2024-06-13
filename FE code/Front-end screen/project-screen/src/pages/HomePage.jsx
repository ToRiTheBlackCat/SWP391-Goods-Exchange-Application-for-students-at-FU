
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import Category from '../components/Category';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Category/>
      <div className="container mt-4">
      <h2 className={styles.heading}>Product</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default HomePage;