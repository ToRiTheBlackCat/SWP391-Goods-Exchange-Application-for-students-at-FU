
import PropTypes from 'prop-types';
import styles from '../styles/WaitingProduct.module.css';

const WaitingProductList = ({ products, onSelectProduct }) => {
    return (
      <div className={`col-md-4 ${styles.col}`}>
        <h3>Your exchange request</h3>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.productId} onClick={() => onSelectProduct(product)}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.productOwner.userName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  WaitingProductList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
      productId: PropTypes.number.isRequired,
      productName: PropTypes.string.isRequired,
      productOwner: PropTypes.shape({
        userName: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
    onSelectProduct: PropTypes.func.isRequired,
  };
  
  export default WaitingProductList;

