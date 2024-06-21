import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/PostForm.module.css';
import axiosInstance from '../../../authorized/axiosInstance'; // Import axiosInstance
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
        const userId = localStorage.getItem('userId');
        if (userId) {
            setFormData(prevState => ({
                ...prevState,
                userId: parseInt(userId)
            }));
        } else {
            console.error('User ID không được tìm thấy trong localStorage');
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
            alert('Vui lòng chọn một file hình ảnh hợp lệ');
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = new FormData();
            data.append('productName', formData.productName);
            data.append('productDescription', formData.productDescription);
            data.append('productPrice', formData.productPrice);
            data.append('typeId', formData.typeId);
            data.append('userId', formData.userId);

            if (imageFile) {
                data.append('productImage', imageFile); // Đính kèm file ảnh thực tế
            }

            // Hiển thị dữ liệu gửi đi trên console
            console.log('Dữ liệu gửi đi:');
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
                alert('Tạo sản phẩm thành công');
                navigate('/');
            }
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
            if (error.response && error.response.status === 403) {
                alert('Từ chối quyền truy cập. Bạn không được phép thực hiện hành động này.');
            } else {
                alert('Lỗi khi tạo sản phẩm.');
            }
        }
    };

    return (
        <div>
            <div className={`container mt-5 ${styles.container}`}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Hình ảnh</label>
                            <div className={`border p-4 text-center ${styles.picturePlaceholder}`} id="picture-placeholder">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Selected" className="img-fluid" />
                                ) : (
                                    "Hình ảnh"
                                )}
                            </div>
                            <input type="file" className="form-control mt-2" onChange={handleImageChange} />
                        </div>
                    </div>
                    <div className="col-md-9">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="typeId">Danh mục</label>
                                <select className="form-control" id="typeId" value={formData.typeId} onChange={handleInputChange}>
                                    <option value="0">Chọn một danh mục</option>
                                    <option value="1">Điện tử</option>
                                    <option value="2">Phụ kiện</option>
                                    <option value="3">Đồ gia dụng</option>
                                    <option value="4">Sách</option>
                                    <option value="5">Dụng cụ học tập</option>
                                    <option value="6">Quần áo</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="productName">Tên</label>
                                    <input type="text" className="form-control" id="productName" placeholder="Nhập tên sản phẩm" value={formData.productName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="productPrice">Giá</label>
                                    <input type="numeric" className="form-control" id="productPrice" placeholder="Nhập giá sản phẩm" value={formData.productPrice} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="productDescription">Mô tả chi tiết</label>
                                <textarea className="form-control" id="productDescription" rows="4" placeholder="Nhập mô tả chi tiết" value={formData.productDescription} onChange={handleInputChange} required></textarea>
                            </div>
                            <button type="submit" className={`btn ${styles.btnWarning} text-white`}>Tạo</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostProductForm;
