
import PropTypes from 'prop-types';

function Sidebar({ products, setSelectedProduct }) {
  return (
    <ul className="list-group" id="product-list">
      {products.map((product, index) => (
        <li
          key={index}
          className="list-group-item"
          onClick={() => setSelectedProduct(product)}
          data-image={product.image}
          data-name={product.name}
          data-price={product.price}
          data-description={product.description}
        >
          {product.name}
        </li>
      ))}
    </ul>
  );
}

Sidebar.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedProduct: PropTypes.func.isRequired,
};

export default Sidebar;
