import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedProduct, setSelectedProduct } from '../store/store';
import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/UpdateProduct.module.css';
import Navbar from '../components/Navbar';
import axiosInstance from '../../utils/axiosInstance';

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedProduct = useSelector(state => state.product.selectedProduct);

  const [product, setProduct] = useState({
    productId: 0,
    productName: '',
    productImage: '',
    productDescription: '',
    productPrice: '',
    typeId: 0,
    userId: 0
  });

  const [imageBase64, setImageBase64] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (selectedProduct && selectedProduct.productId === parseInt(id, 10)) {
      setProduct({
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        productImage: selectedProduct.productImage,
        productDescription: selectedProduct.productDescription,
        productPrice: formatNumber(selectedProduct.productPrice),
        typeId: selectedProduct.typeId,
        userId: userId // Thiết lập userId từ localStorage
      });
      if (selectedProduct.productImage) {
        fetchProductImage(selectedProduct.productImage);
      }
    } else {
      axiosInstance.get(`/api/Product/Student/ViewProductDetailWithId/${id}`)
        .then(response => {
          const data = response.data;
          setProduct({
            productId: data.productId,
            productName: data.productName,
            productImage: data.productImage,
            productDescription: data.productDescription,
            productPrice: formatNumber(data.productPrice),
            typeId: data.typeId,
            userId: userId // Thiết lập userId từ localStorage
          });
          if (data.productImage) {
            fetchProductImage(data.productImage);
          }
        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, selectedProduct, dispatch]);

  const fetchProductImage = (imageName) => {
    axiosInstance.get(`/api/Product/GetUserImage?imageName=${imageName}`)
      .then(response => {
        setImageBase64(`data:image/jpeg;base64,${response.data}`);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productPrice") {
      const numericValue = value.replace(/\D/g, ''); // Remove non-digit characters
      const formattedValue = formatNumber(numericValue);
      setProduct({ ...product, [name]: formattedValue });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setProduct({ ...product, productImage: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericPrice = product.productPrice.replace(/\./g, ''); // Convert formatted price to numeric
    const formData = new FormData();
    formData.append('productId', product.productId);
    formData.append('productName', product.productName);
    formData.append('productDescription', product.productDescription);
    formData.append('productPrice', numericPrice);
    formData.append('typeId', product.typeId);
    formData.append('userId', product.userId);

    if (file) {
      formData.append('productImage', file);
    } else {
      formData.append('productImage', product.productImage);
    }

    // Log FormData values
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await axiosInstance.put(`/api/Product/Student/UpdateProduct`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('API Response:', response.data); // Kiểm tra phản hồi từ API
      toast.success('Product updated successfully');
      // Cập nhật Redux store
      dispatch(setSelectedProduct(product));
      console.log('Updated Product in Redux:', product);
      setTimeout(() => {
        navigate(-1);
      }, 3000); // Navigate back after 3 seconds
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`Error updating product`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm w-100">
          <div className="row">
            <div className="col-md-4 d-flex flex-column align-items-center">
              <div className="mb-3">
                <label htmlFor="productImage" className="form-label">Image</label>
                <input
                  type="file"
                  id="productImage"
                  name="productImage"
                  onChange={handleFileChange}
                  className="form-control"
                />
                {imageBase64 && <img src={imageBase64} alt="Product" className={`img-thumbnail mt-2 ${styles.imagePreview}`} />}
              </div>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="typeId" className="form-label">Category</label>
                <select
                  id="typeId"
                  name="typeId"
                  value={product.typeId}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Choose a category</option>
                  <option value="1">Electronic</option>
                  <option value="2">Books</option>
                  <option value="3">Accessories</option>
                  <option value="4">Housewares</option>
                  <option value="5">School supplies</option>
                  <option value="6">Clothes</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={product.productName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter product name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productPrice" className="form-label">Price</label>
                <input
                  type="text"
                  id="productPrice"
                  name="productPrice"
                  value={product.productPrice}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter product price"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productDescription" className="form-label">Detailed description</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={product.productDescription}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter a detailed description"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-warning">Update</button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />  {/* Add ToastContainer for displaying toasts */}
    </>
  );
}

export default UpdateProduct;

const formatNumber = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};
