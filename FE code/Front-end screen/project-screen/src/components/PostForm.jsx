import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/PostForm.module.css';
import axiosInstance from '../authorized/axiosInstance'; // Import axiosInstance
import { useNavigate } from 'react-router-dom';

function PostProductForm() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        productName: '',
        productImage: '',
        productDescription: '',
        productPrice: '',
        typeId: '0',
        userId: '' // Replace this with actual userId from localStorage or context
    });
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setFormData(prevState => ({
                    ...prevState,
                    productImage: reader.result
                }));
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Fetch userId from localStorage or context
        const userId = localStorage.getItem('userId');
        const data = {
            ...formData,
            userId: userId ? parseInt(userId) : 0
        };

        try {
            const response = await axiosInstance.post('/api/Product/Student/AddNewProduct', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200 || response.status === 201) {
                alert('Product created successfully');
                navigate('/'); // Navigate to another page after successful creation
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product.');
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
                                    <option value="0">Select a category</option>
                                    <option value="1">Electronics</option>
                                    <option value="2">Accessories</option>
                                    <option value="3">Houseware</option>
                                    <option value="4">Book</option>
                                    <option value="5">School Supplies</option>
                                    <option value="6">Clothes</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="productName">Name</label>
                                    <input type="text" className="form-control" id="productName" placeholder="Enter product name" value={formData.productName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="productPrice">Price</label>
                                    <input type="number" className="form-control" id="productPrice" placeholder="Enter product price" value={formData.productPrice} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="productDescription">Detailed Description</label>
                                <textarea className="form-control" id="productDescription" rows="4" placeholder="Enter detailed description" value={formData.productDescription} onChange={handleInputChange} required></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Seller Information</label>
                                <input type="text" className="form-control" id="address" placeholder="Enter seller address" value={formData.address} onChange={handleInputChange} required />
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
