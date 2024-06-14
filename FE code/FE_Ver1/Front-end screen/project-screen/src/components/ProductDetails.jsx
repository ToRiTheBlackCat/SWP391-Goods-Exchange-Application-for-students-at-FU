
// import unnamed from './ảnh/unnamed.webp';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function ProductDetails({ product }) {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSelect = () => {
    navigate('/exchange-page'); // Điều hướng đến trang exchangePage
  };

  const handleDecline = () => {
    navigate(-1); // Quay lại trang trước đó
  };
  return (
    <>
      <img src={product.image} alt="Product Image" className="img-fluid product-image mb-3" id="product-image" />
      <div className="info w-50">
        <div className="form-group row">
          <label className="col-sm-3 col-form-label font-weight-bold">Name</label>
          <div className="col-sm-9">
            <input type="text" readOnly className="form-control-plaintext" id="product-name" value={product.name} />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label font-weight-bold">Price</label>
          <div className="col-sm-9">
            <input type="text" readOnly className="form-control-plaintext" id="product-price" value={product.price} />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label font-weight-bold">Description</label>
          <div className="col-sm-9">
            <input type="text" readOnly className="form-control-plaintext" id="product-description" value={product.description} />
          </div>
        </div>
      </div>
      <div className="mt-4">
      <button className={`btn btn-success btn-lg `} onClick={handleSelect}>Select</button>
        <button className={`btn btn-danger btn-lg `} onClick={handleDecline}>Decline</button>
      </div>
    </>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProductDetails;
