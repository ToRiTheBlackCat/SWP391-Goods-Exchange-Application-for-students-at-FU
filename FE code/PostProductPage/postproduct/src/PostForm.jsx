// src/PostProductForm.js

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function PostProductForm() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">Home</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Category</a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Sign up</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link btn btn-warning text-white" href="#">Post</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Picture</label>
                            <div className="border p-4 text-center" id="picture-placeholder">Picture</div>
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

                            <button type="submit" className="btn btn-warning text-white">Post</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostProductForm;
