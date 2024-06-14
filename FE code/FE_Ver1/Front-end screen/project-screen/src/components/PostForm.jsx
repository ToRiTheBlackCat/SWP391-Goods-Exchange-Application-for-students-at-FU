import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/PostForm.module.css';
import axiosInstance from '../authorized/axiosInstance'; // Import axiosInstance
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

function PostProductForm() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        productName: '',
        productImage: '',
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
            // Xử lý trường hợp không tìm thấy userId trong localStorage
            console.error('User ID không được tìm thấy trong localStorage');
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setFormData(prevState => ({
                    ...prevState,
                    productImage: file.name // Lưu tên file để upload sau
                }));
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
            // Kiểm tra xem formData.productImage có tồn tại không
            // if (formData.productImage) {
            //     const encodedImageName = encodeURIComponent(formData.productImage); // Mã hóa tên tệp
            //     // Gửi yêu cầu API với tên tệp đã mã hóa
            //     const uploadResponse = await axios.get(`http://localhost:5299/api/Product/GetUserImage?imageName=${encodedImageName}`, {
            //         headers: {
            //             'Content-Type': 'multipart/form-data'
            //         }
            //     });
    
            //     if (uploadResponse.data.fileName) {
            //         // Cập nhật tên tệp trong formData
            //         setFormData(prevState => ({
            //             ...prevState,
            //             productImage: uploadResponse.data.fileName
            //         }));
            //     }
            // }
    
            console.log('Dữ liệu đang gửi:', formData);
            const response = await axiosInstance.post('/api/Product/Student/AddNewProduct', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Header Authorization tự động được thêm bởi axiosInstance
                }
            });
    
            if (response.status === 200 || response.status === 201) {
                alert('Tạo sản phẩm thành công');
                navigate('/'); // Điều hướng đến trang khác sau khi tạo thành công
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
                                    <input type="number" className="form-control" id="productPrice" placeholder="Nhập giá sản phẩm" value={formData.productPrice} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="productDescription">Mô tả chi tiết</label>
                                <textarea className="form-control" id="productDescription" rows="4" placeholder="Nhập mô tả chi tiết" value={formData.productDescription} onChange={handleInputChange} required></textarea>
                            </div>
                            {/* <div>
                                <label>Ảnh sản phẩm</label>
                                <img src={`http://localhost:5299/api/Product/GetUserImage?imageName=${formData.productImage}`} alt="Product" className="img-fluid" />
                            </div> */}
                            <div className="form-group">
        <label>Ảnh sản phẩm</label>
        <img src={selectedImage} alt="Product" className="img-fluid" />
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
