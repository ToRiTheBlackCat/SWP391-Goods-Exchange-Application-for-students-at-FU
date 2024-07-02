import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedProduct, setSelectedProduct } from '../store/store';
import styles from '../styles/UpdateProduct.module.css';
import Navbar from '../components/Navbar';
import axiosInstance from '../../authorized/axiosInstance';

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
    productPrice: 0,
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
        productPrice: selectedProduct.productPrice,
        typeId: selectedProduct.typeId,
        userId: userId // Thiết lập userId từ localStorage
      });
      if (selectedProduct.productImage) {
        fetchProductImage(selectedProduct.productImage);
      }
    } else {
      axios.get(`https://localhost:7027/api/Product/Student/ViewProductDetailWithId/${id}`)
        .then(response => {
          const data = response.data;
          setProduct({
            productId: data.productId,
            productName: data.productName,
            productImage: data.productImage,
            productDescription: data.productDescription,
            productPrice: data.productPrice,
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
    axios.get(`https://localhost:7027/api/Product/GetUserImage?imageName=${imageName}`)
      .then(response => {
        setImageBase64(`data:image/jpeg;base64,${response.data}`);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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
    const formData = new FormData();
    formData.append('productId', product.productId);
    formData.append('productName', product.productName);
    formData.append('productImage', file);
    formData.append('productDescription', product.productDescription);
    formData.append('productPrice', product.productPrice);
    formData.append('typeId', product.typeId);
    formData.append('userId', product.userId);

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
      alert('Product updated successfully');
      // Cập nhật Redux store
      dispatch(setSelectedProduct(product));
      console.log('Updated Product in Redux:', product);
      navigate(-1);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
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
                <label htmlFor="productImage" className="form-label">Hình ảnh</label>
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
                <label htmlFor="typeId" className="form-label">Danh mục</label>
                <select
                  id="typeId"
                  name="typeId"
                  value={product.typeId}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Chọn một danh mục</option>
                  <option value="1">Electronic</option>
                  <option value="2">Books</option>
                  <option value="3">Accessories</option>
                  <option value="4">Housewares</option>
                  <option value="5">School supplies</option>
                  <option value="6">Clothes</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="productName" className="form-label">Tên</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={product.productName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productPrice" className="form-label">Giá</label>
                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  value={product.productPrice}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập giá sản phẩm"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productDescription" className="form-label">Mô tả chi tiết</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={product.productDescription}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nhập mô tả chi tiết"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-warning">Cập nhật</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateProduct;
