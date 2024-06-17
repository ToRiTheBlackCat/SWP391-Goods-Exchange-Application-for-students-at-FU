// src/PostProductForm.js
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/PostForm.module.css';

function PostProductForm() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(URL.createObjectURL(file));
        }else{
            alert('Please select a valid image file');
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
                        <form>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select className="form-control" id="category">
                                    <option value="electronics">Electronics</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="houseware">Houseware</option>
                                    <option value="book">Book</option>
                                    <option value="school-supplies">School Supplies</option>
                                    <option value="clothes">Clothes</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Enter product name" required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="price">Price</label>
                                    <input type="text" className="form-control" id="price" placeholder="Enter product price" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="postTitle">Post Title</label>
                                <input type="text" className="form-control" id="postTitle" placeholder="Enter post title" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Detailed Description</label>
                                <textarea className="form-control" id="description" rows="4" placeholder="Enter detailed description" required></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Seller Information</label>
                                <input type="text" className="form-control" id="address" placeholder="Enter seller address" required />
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
