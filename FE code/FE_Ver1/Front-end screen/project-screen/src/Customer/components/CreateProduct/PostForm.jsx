import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/PostForm.module.css';
import axiosInstance from '../../../utils/axiosInstance'; // Import axiosInstance
import { useNavigate } from 'react-router-dom';

function PostProductForm() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null); // Lưu file ảnh thực tế
    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        productPrice: '',
        typeId: '',
        userId: '' // Thay thế bằng userId thực sự từ localStorage hoặc context
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const userId = user.userId;
        if (userId) {
            setFormData(prevState => ({
                ...prevState,
                userId: parseInt(userId)
            }));
        } else {
            console.error('User ID was not found in localStorage');
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file); // Lưu file ảnh thực tế để upload sau
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file');
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const formatCurrency = (value) => {
        return value.replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (event) => {
        const formattedValue = formatCurrency(event.target.value);
        setFormData(prevState => ({
            ...prevState,
            productPrice: formattedValue
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = new FormData();
            data.append('productName', formData.productName);
            data.append('productDescription', formData.productDescription);
            data.append('productPrice', formData.productPrice.replace(/\./g, '')); // Loại bỏ dấu chấm
            data.append('typeId', formData.typeId);
            data.append('userId', formData.userId);

            if (imageFile) {
                data.append('productImage', imageFile); // Đính kèm file ảnh thực tế
            }

            // Hiển thị dữ liệu gửi đi trên console
            console.log('Data sent:');
            for (let pair of data.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: [File]`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            const response = await axiosInstance.post('/api/Product/Student/AddNewProduct', data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Create successful products');
                navigate('/');
            }
        } catch (error) {
            console.error('Error while creating product:', error);
            if (error.response && error.response.status === 403) {
                alert('Deny access. You are not authorized to perform this action.');
            } else {
                alert('Error while creating product.');
            }
        }
    };

    return (
        <div>
            <div className={`container mt-5 ${styles.container}`}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Picture</label>
                            <div className={`border p-4 text-center ${styles.picturePlaceholder}`} id="picture-placeholder">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Selected" className="img-fluid" />
                                ) : (
                                    "Picture"
                                )}
                            </div>
                            <input type="file" className="form-control mt-2" onChange={handleImageChange} />
                        </div>
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="typeId">Category</label>
                                <select className="form-control" id="typeId" value={formData.typeId} onChange={handleInputChange}>
                                    <option value="0">Choose a category</option>
                                    <option value="1">Electronics</option>
                                    <option value="2">Books</option>
                                    <option value="3">Accessories</option>
                                    <option value="4">Housewares</option>
                                    <option value="5">School supplies</option>
                                    <option value="6">Clothes</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="productName">Name</label>
                                    <input type="text" className="form-control" id="productName" placeholder="Nhập tên sản phẩm" value={formData.productName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="productPrice">Price</label>
                                    <input type="text" className="form-control" id="productPrice" placeholder="Nhập giá sản phẩm" value={formData.productPrice} onChange={handlePriceChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="productDescription">Description</label>
                                <textarea className="form-control" id="productDescription" rows="4" placeholder="Nhập mô tả chi tiết" value={formData.productDescription} onChange={handleInputChange} required></textarea>
                            </div>
                            <button type="submit" className={`btn ${styles.btnWarning} text-white`}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostProductForm;
