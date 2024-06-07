
import PropTypes from 'prop-types';
import styles from '../styles/ProductCard.module.css';

const ProductCard = ({ product }) => {
  return (
    <div className={`card ${styles.card}`}>
      <img className={`card-img-top ${styles.cardImgTop}`} src={product.imgSrc} alt={product.alt} />
      <div className={`card-body ${styles.cardBody}`}>
        <h5 className={`card-title ${styles.cardTitle}`}><a href={product.link}>{product.title}</a></h5>
        <p className={`card-text ${styles.cardText}`}>{product.condition}</p>
        {/* <p className={`card-text ${styles.cardText}`}>{product.color}</p> */}
        {product.size && <p className={`card-text ${styles.cardText}`}>{product.size}</p>}
        <p className={`card-text ${styles.cardText} ${styles.textDanger}`}>{product.price}</p>
        <p className={`card-text ${styles.cardText}`}>{product.seller} - Rating: <span className={styles.textWarning}>{product.rating}/5</span></p>
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
    // color: PropTypes.string.isRequired,
    size: PropTypes.string,
    price: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
