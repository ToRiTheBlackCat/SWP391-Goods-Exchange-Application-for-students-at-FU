import PropTypes from 'prop-types';
import styles from '../../styles/ChooseProduct.module.css';

function ListProduct({ products, setSelectedProduct }) {
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Selling'; 
      case 2:
        return 'Exchanging';
      case 3:
        return 'Waiting';
      default:
        return 'Undefined';
    }
  };

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id} onClick={() => setSelectedProduct(product)} className={styles.clickableRow}>
            <th scope="row">{index + 1}</th>
            <td>{product.name}</td>
            <td>{getStatusText(product.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

ListProduct.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      status: PropTypes.number.isRequired, // Add status to prop types
    })
  ).isRequired,
  setSelectedProduct: PropTypes.func.isRequired,
};

export default ListProduct;
