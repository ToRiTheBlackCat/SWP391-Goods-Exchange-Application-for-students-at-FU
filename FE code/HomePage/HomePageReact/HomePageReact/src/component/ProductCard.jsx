
import PropTypes from 'prop-types';

const ProductCard = ({ imgSrc, alt, title, link, condition, color, size, price, seller, rating }) => {
  return (
    <div className="card mb-4">
      <img className="card-img-top" src={imgSrc} alt={alt} />
      <div className="card-body">
        <h5 className="card-title"><a href={link}>{title}</a></h5>
        <p className="card-text condition">{condition}</p>
        <p className="card-text color">{color}</p>
        {size && <p className="card-text size">{size}</p>}
        <p className="card-text price text-danger">{price}</p>
        <p className="card-text seller">{seller} - Rating: <span className="rating text-warning">{rating}/5</span></p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  condition: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.string,
  price: PropTypes.string.isRequired,
  seller: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired
};

ProductCard.defaultProps = {
  size: ''
};

export default ProductCard;
