import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  return (
    <div className="card mb-4">
      <img className="card-img-top" src={product.imgSrc} alt={product.alt} />
      <div className="card-body">
        <h5 className="card-title"><a href={product.link}>{product.title}</a></h5>
        <p className="card-text condition">{product.condition}</p>
        <p className="card-text color">{product.color}</p>
        {product.size && <p className="card-text size">{product.size}</p>}
        <p className="card-text price text-danger">{product.price}</p>
        <p className="card-text seller">{product.seller} - Rating: <span className="rating text-warning">{product.rating}/5</span></p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    imgSrc: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.string,
    price: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
