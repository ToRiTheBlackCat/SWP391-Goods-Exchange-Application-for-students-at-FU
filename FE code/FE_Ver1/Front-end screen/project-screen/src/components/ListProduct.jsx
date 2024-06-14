import PropTypes from 'prop-types';
import styles from '../styles/ChooseProduct.module.css';

function ListProduct({ products, setSelectedProduct }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col">Name</th>
          {/* <th scope="col">Price</th> */}
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id} onClick={() => setSelectedProduct(product)} className={styles.clickableRow}>
            <th scope="row">{index + 1}</th>
            <td>{product.name}</td>
            {/* <td>{product.price}</td> */}
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
      price: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedProduct: PropTypes.func.isRequired,
};

export default ListProduct;